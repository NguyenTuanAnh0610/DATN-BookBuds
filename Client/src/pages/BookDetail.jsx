import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Badge,
  Grid,
  GridItem,
  Flex,
  Spacer,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import bookApi from "../apis/bookApi";
import { StarIcon } from "@chakra-ui/icons";



const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch book details
        const bookResponse = await bookApi.getDetailBook(id);
        setBook(bookResponse);

        // Fetch related books from same category
        if (bookResponse.categories_id) {
          const relatedBooksResponse = await bookApi.getBooksByCategory(bookResponse.categories_id);
          // Filter out the current book and limit to 4 books
          setRelatedBooks(relatedBooksResponse.filter(b => b.id !== parseInt(id)).slice(0, 4));
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sách",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchData();

  }, [id, toast]);


  if (!book) return <Box p={5}><Text>Đang tải...</Text></Box>;

  return (
    <Box maxW="7xl" mx="auto" px={{ base: '4', md: '8', lg: '12' }} py={8}>
      {/* Breadcrumb */}
      <Breadcrumb mb={6} fontSize="sm" color="gray.600">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/books">Sách</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <Text>{book.title}</Text>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main Content */}
      <Grid templateColumns={{ base: '1fr', md: '400px 1fr' }} gap={8}>
        {/* Left Column - Image */}
        <GridItem>
          <Box 
            borderRadius="lg" 
            overflow="hidden" 
            boxShadow="lg"
            bg="white"
            position="sticky"
            top="20px"
          >
            <Image
              src={book.image}
              alt={book.title}
              width="100%"
              height="auto"
              objectFit="cover"
            />
          </Box>
        </GridItem>

        {/* Right Column - Details */}
        <GridItem>
          <VStack align="stretch" spacing={6}>
            {/* Title and Basic Info */}
            <Box>
              <Text fontSize="3xl" fontWeight="bold" mb={4}>
                {book.title}
              </Text>
              <HStack spacing={4} mb={4}>
                <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                  {book.book_type === 'PRINT' ? 'Sách in' : book.book_type}
                </Badge>
                <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                  {book.cover_type === 'HARDCOVER' ? 'Bìa cứng' : 'Bìa mềm'}
                </Badge>
                <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                  {book.category?.name}
                </Badge>
              </HStack>
            </Box>

            {/* Price and Actions */}
            <Box 
              p={6} 
              bg="gray.50" 
              borderRadius="lg" 
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Text fontSize="3xl" fontWeight="bold" color="red.500" mb={4}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
              </Text>
              <HStack spacing={4} mb={4}>
                <NumberInput 
                  size="lg" 
                  maxW={32} 
                  defaultValue={1} 
                  min={1} 
                  max={book.stock_quantity}
                  value={quantity}
                  onChange={(value) => setQuantity(parseInt(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text color="gray.600">
                  Còn {book.stock_quantity} sản phẩm
                </Text>
              </HStack>
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiShoppingCart />}
                  colorScheme="blue"
                  size="lg"
                  flex={1}
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  colorScheme="red"
                  size="lg"
                  flex={1}
                >
                  Mua ngay
                </Button>
              </HStack>
            </Box>

            {/* Book Details */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Thông tin chi tiết
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Tác giả:</Text>
                      <Text>{book.author}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Nhà xuất bản:</Text>
                      <Text>{book.publisher}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Năm xuất bản:</Text>
                      <Text>{book.publication_year}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Ngôn ngữ:</Text>
                      <Text>{book.language}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
                <GridItem>
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">ISBN:</Text>
                      <Text>{book.isbn}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Kích thước:</Text>
                      <Text>{book.dimensions}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Trọng lượng:</Text>
                      <Text>{book.book_weight}g</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" color="gray.600">Loại giấy:</Text>
                      <Text>{book.paper_type}</Text>
                    </HStack>
                  </VStack>
                </GridItem>
              </Grid>
            </Box>

            {/* Description */}
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Mô tả sản phẩm
              </Text>
              <Text 
                whiteSpace="pre-wrap" 
                color="gray.700"
                p={4}
                bg="gray.50"
                borderRadius="md"
              >
                {book.description}
              </Text>
            </Box>
          

            {/* Related Books */}
            <Box mt={8}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Sách cùng danh mục
              </Text>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
                {relatedBooks.map((relatedBook) => (
                  <Box 
                    key={relatedBook.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg="white"
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.02)' }}
                    cursor="pointer"
                    onClick={() => navigate(`/book/${relatedBook.id}`)}
                  >
                    <Image
                      src={relatedBook.image}
                      alt={relatedBook.title}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    <Box p={4}>
                      <Text
                        fontWeight="semibold"
                        fontSize="md"
                        noOfLines={2}
                        mb={2}
                      >
                        {relatedBook.title}
                      </Text>
                      <Text color="red.500" fontWeight="bold">
                        {formatPrice(relatedBook.price)}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BookDetail;
