import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Image, Text, Container, SimpleGrid, Badge, VStack, HStack } from '@chakra-ui/react';
import categoryApi from '../../apis/categoryApi';
import bookApi from '../../apis/bookApi';

const Product = () => {
    const [categories, setCategories] = useState([]);
    const [booksByCategory, setBooksByCategory] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories
        categoryApi.getListCategory().then(response => {
            setCategories(response);
            response.forEach(category => {
                // Fetch books for each category
                bookApi.getBooksByCategory(category.id).then(bookResponse => {
                    // Filter out books with status 'INACTIVE'
                    const activeBooks = bookResponse.filter(book => book.status !== 'INACTIVE');
                    setBooksByCategory(prevState => ({
                        ...prevState,
                        [category.id]: activeBooks
                    }));
                });
            });
        });
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    const formatPriceToVND = (price) => {
        return (price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <Container maxW="7xl" py={5}>
            {categories.map(category => {
                const books = booksByCategory[category.id] || [];

                // Only render the category if there are books
                if (books.length === 0) return null;

                return (
                    <Box key={category.id} mb={10}>
                        <Box bg="gray.100" py={4} borderRadius="md" boxShadow="sm" mb={4} textAlign="center">
                            <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                                {category.name}
                            </Text>
                            <Text fontSize="md" color="gray.500">
                                Tủ {category.name}
                            </Text>
                        </Box>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                            {books.slice(0, 4).map(book => (
                                <Box
                                    key={book.id}
                                    p={5}
                                    bg="white"
                                    boxShadow="lg"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    transition="transform 0.2s"
                                    _hover={{ transform: 'scale(1.05)' }}
                                    onClick={() => handleBookClick(book.id)}
                                >
                                    <VStack spacing={3} align="start">
                                        <Image src={book.image} alt={book.title} borderRadius="md" boxSize="200px" objectFit="cover" />
                                        <Text fontWeight="bold" fontSize="lg" noOfLines={2}>{book.title}</Text>
                                        <Text fontWeight="bold" fontSize="md">Thể loại và Ngôn ngữ:</Text>
                                        <HStack spacing={2}>
                                            <Badge colorScheme="green">{book.genre}</Badge>
                                            <Badge colorScheme="blue">{book.language}</Badge>
                                        </HStack>
                                        <Text fontWeight="bold" fontSize="md">Giá:</Text>
                                        <Text color="red.500" fontWeight="bold" fontSize="xl">{formatPriceToVND(book.price)}</Text>
                                    </VStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
                );
            })}
        </Container>
    );
};

export default Product;
