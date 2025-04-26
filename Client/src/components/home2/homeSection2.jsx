import React from 'react';
import { Box, Image, Text, Button, Flex, Container } from '@chakra-ui/react';

const PromotionalSection = () => {
    return (
        <Container maxW="7xl" p={5} bg="#f8f8f8">
            <Flex justify="space-between">
                <Box textAlign="center" width="23%" position="relative">
                    <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/TrangCTT11_1124_Tusachphapluat_Resize_310x210.png" alt="Promo 1" borderRadius="md" />
                    
                </Box>
                <Box textAlign="center" width="23%" position="relative">
                    <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/NgoaiVan_T11_310x210.jpg" alt="Promo 2" borderRadius="md" />
                  
                </Box>
                <Box textAlign="center" width="23%" position="relative">
                    <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/Diamond_1124_Smallbanner_310x210.png" alt="Promo 3" borderRadius="md" />
                   
                </Box>
                <Box textAlign="center" width="23%" position="relative">
                    <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/Trang20_11_SmallBanner_T11_310x210_1.jpg" alt="Promo 4" borderRadius="md" />
                    
                </Box>
            </Flex>
        </Container>
    );
};

export default PromotionalSection;
