import React, { useState, useEffect } from "react";
import { Box, Input, Select, Grid, GridItem, VStack, Image, Text, HStack, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Spinner } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; 
import bookApi from "../apis/bookApi"; 
import categoryApi from "../apis/categoryApi";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadProducts = async () => {
      const response = await bookApi.getListBooks();
      const activeProducts = response.filter(product => product.status !== 'INACTIVE');
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await categoryApi.getListCategory();
      setCategories(response);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts(searchTerm, category, minPrice, maxPrice);
  }, [searchTerm, category, minPrice, maxPrice]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    console.log(selectedCategory)
    setCategory(selectedCategory);
  };

  const handlePriceChange = (event, type) => {
    const value = event.target.value;
    if (type === "min") {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  const filterProducts = (term, category, minPrice, maxPrice) => {
    let filtered = [...products];

    if (term) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((product) => Number(product.categories_id) === Number(category));
    }

    if (minPrice) {
      filtered = filtered.filter((product) => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter((product) => product.price <= parseFloat(maxPrice));
    }

    filtered = filtered.filter((product) => product.status !== 'INACTIVE');

    setFilteredProducts(filtered);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box maxW="1200px" mx="auto" py={10} px={5}>
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={5}>
        <BreadcrumbItem><BreadcrumbLink href="/">Trang chủ</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbItem isCurrentPage><BreadcrumbLink href="#">Sản phẩm</BreadcrumbLink></BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={5} mb={10}>
        <Heading as="h1" fontSize="3xl" textAlign="center">Danh Sách Sản Phẩm</Heading>

        <HStack spacing={5} w="full" maxW="1000px">
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchTerm}
            onChange={handleSearch}
            bg="white"
            shadow="sm"
            borderRadius="md"
            _placeholder={{ color: "gray.500" }}
            focusBorderColor="blue.400"
          />
          <Select
            placeholder="Tất cả danh mục"
            value={category}
            onChange={handleCategoryChange}
            bg="white"
            shadow="sm"
            borderRadius="md"
            focusBorderColor="blue.400"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
          <Input
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChange={(e) => handlePriceChange(e, "min")}
            bg="white"
            shadow="sm"
            borderRadius="md"
            _placeholder={{ color: "gray.500" }}
            focusBorderColor="blue.400"
            type="number"
          />
          <Input
            placeholder="Giá tối đa"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e, "max")}
            bg="white"
            shadow="sm"
            borderRadius="md"
            _placeholder={{ color: "gray.500" }}
            focusBorderColor="blue.400"
            type="number"
          />
        </HStack>
      </VStack>

      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {currentProducts.map((product) => (
          <GridItem key={product.id}>
            <ProductCard product={product} />
          </GridItem>
        ))}
      </Grid>

      <HStack spacing={4} mt={5} justify="center">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button key={index + 1} onClick={() => handlePageChange(index + 1)} colorScheme={currentPage === index + 1 ? "blue" : "gray"}>
            {index + 1}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="md"
      _hover={{ transform: "scale(1.05)", transition: "0.3s ease" }}
      onClick={() => handleBookClick(product.id)}
      cursor="pointer"
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Image src={product.image} alt={product.title} objectFit="cover" w="100%" h="200px" />
      <VStack spacing={3} p={5} align="start" flex="1">
        <Text fontWeight="bold" fontSize="lg" noOfLines={2}>{product.title}</Text>
        <HStack><Text color="gray.500">Tác giả:</Text><Text>{product.author}</Text></HStack>
        <Text fontWeight="bold" color="red.500">{formattedPrice}</Text>
      </VStack>
    </Box>
  );
};

export default ProductPage;
