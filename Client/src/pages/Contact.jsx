'use client'

import {
  Container,
  Flex,
  Box,
  Heading,
  Text,
  IconButton,
  Button,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Textarea,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdFacebook,
  MdOutlineEmail,
} from 'react-icons/md';
import { BsGithub, BsDiscord, BsPerson } from 'react-icons/bs';
import { ChevronRightIcon } from '@chakra-ui/icons';

export default function Contact() {
  return (
    <Container bg="#f0f4f8" maxW="full" mt={0} centerContent overflow="hidden">
     
      <Flex>
      <Breadcrumb spacing="8px"pt={4} separator={<ChevronRightIcon color="gray.500" />} mb={8}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" _hover={{ textDecoration: "none", color: "blue.500" }}>
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#" color="blue.500" fontWeight="semibold">
            Liên hệ
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
        <Box
          bg="#1a202c"
          color="white"
          borderRadius="lg"
          m={{ sm: 4, md: 16, lg: 10 }}
          p={{ sm: 5, md: 5, lg: 16 }}>
          <Box p={4}>
            
            <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
              <WrapItem>
                <Box>
                  <Heading>Liên hệ</Heading>
                  <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.300">
                    Điền vào biểu mẫu dưới đây để liên hệ với chúng tôi
                  </Text>
                  <Box py={{ base: 5, sm: 5, md: 8, lg: 10 }}>
                    <VStack pl={0} spacing={3} alignItems="flex-start">
                      <Button
                        size="md"
                        height="48px"
                        width="200px"
                        variant="ghost"
                        color="#DCE2FF"
                        _hover={{ border: '2px solid #3182ce' }}
                        leftIcon={<MdPhone color="white" size="20px" />}>
                        +84-123456789
                      </Button>
                      <Button
                        size="md"
                        height="48px"
                        width="200px"
                        variant="ghost"
                        color="#DCE2FF"
                        _hover={{ border: '2px solid #3182ce' }}
                        leftIcon={<MdEmail color="white" size="20px" />}>
                        lienhe@abc.com
                      </Button>
                      <Button
                        size="md"
                        height="48px"
                        width="200px"
                        variant="ghost"
                        color="#DCE2FF"
                        _hover={{ border: '2px solid #3182ce' }}
                        leftIcon={<MdLocationOn color="white" size="20px" />}>
                        Hà Nội, Việt Nam
                      </Button>
                    </VStack>
                  </Box>
                  <HStack
                    mt={{ lg: 10, md: 10 }}
                    spacing={5}
                    px={5}
                    alignItems="flex-start">
                    <IconButton
                      aria-label="facebook"
                      variant="ghost"
                      size="lg"
                      isRound={true}
                      _hover={{ bg: '#3182ce' }}
                      icon={<MdFacebook color="white" size="28px" />}
                    />
                    <IconButton
                      aria-label="github"
                      variant="ghost"
                      size="lg"
                      isRound={true}
                      _hover={{ bg: '#3182ce' }}
                      icon={<BsGithub color="white" size="28px" />}
                    />
                    <IconButton
                      aria-label="discord"
                      variant="ghost"
                      size="lg"
                      isRound={true}
                      _hover={{ bg: '#3182ce' }}
                      icon={<BsDiscord color="white" size="28px" />}
                    />
                  </HStack>
                </Box>
              </WrapItem>
              {/* <WrapItem>
                <Box bg="white" borderRadius="lg">
                  <Box m={8} color="#1a202c">
                    <VStack spacing={5}>
                      <FormControl id="name">
                        <FormLabel>Tên của bạn</FormLabel>
                        <InputGroup borderColor="#E0E1E7">
                          <InputLeftElement pointerEvents="none">
                            <BsPerson color="gray.800" />
                          </InputLeftElement>
                          <Input type="text" size="md" placeholder="Nhập tên của bạn" />
                        </InputGroup>
                      </FormControl>
                      <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <InputGroup borderColor="#E0E1E7">
                          <InputLeftElement pointerEvents="none">
                            <MdOutlineEmail color="gray.800" />
                          </InputLeftElement>
                          <Input type="text" size="md" placeholder="Nhập email của bạn" />
                        </InputGroup>
                      </FormControl>
                      <FormControl id="message">
                        <FormLabel>Tin nhắn</FormLabel>
                        <Textarea
                          borderColor="gray.300"
                          _hover={{
                            borderRadius: 'gray.300',
                          }}
                          placeholder="Nhập tin nhắn của bạn"
                        />
                      </FormControl>
                      <FormControl id="submit" float="right">
                        <Button variant="solid" bg="#3182ce" color="white" _hover={{ bg: '#2b6cb0' }}>
                          Gửi tin nhắn
                        </Button>
                      </FormControl>
                    </VStack>
                  </Box>
                </Box>
              </WrapItem> */}
            </Wrap>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
} 