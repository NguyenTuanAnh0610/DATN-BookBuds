import React from 'react';
import { Box, Image, Flex, Container } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeSection1 = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
    };

    return (
        <Container maxW="7xl" p={5}>
            <Flex justify="space-between">
                <Box textAlign="center" width="70%" position="relative" height="320px">
                    <Slider {...settings}>
                        <div>
                            <Image src="https://cdn0.fahasa.com/media/magentothem/banner7/Diamond_1124_Slide_840x320.png" alt="Promo 1" borderRadius="md" height="100%" />
                        </div>
                        <div>
                            <Image src="https://cdn0.fahasa.com/media/magentothem/banner7/Diamond_1124_AlphaBooks_Resize_Slide_840x320.jpg" alt="Promo 2" borderRadius="md" height="100%" />
                        </div>
                        <div>
                            <Image src="https://cdn0.fahasa.com/media/magentothem/banner7/TrangCTT11_1124_Mainbanner_11.11_840x320_fix.jpg" alt="Promo 3" borderRadius="md" height="100%" />
                        </div>
                    </Slider>
                </Box>
                <Flex direction="column" align="center" width="30%" height="320px">
                    <Box textAlign="center" width="100%" position="relative" mb={4} height="50%">
                        <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/392x156_vnpay_ngay_sale_t11.png" alt="Promo 2" borderRadius="md" height="100%" />
                    </Box>
                    <Box textAlign="center" width="100%" position="relative" height="50%">
                        <Image src="https://cdn0.fahasa.com/media/wysiwyg/Thang-11-2024/shopee_T11_392x156.png" alt="Promo 3" borderRadius="md" height="100%" />
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
};

export default HomeSection1;
