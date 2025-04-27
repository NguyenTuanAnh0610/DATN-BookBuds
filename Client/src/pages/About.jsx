import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Image,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

const About = () => {
  return (
    <Box bg="gray.50" color="gray.700" py={10}>
      
      <Container maxW="8xl">
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={8}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" _hover={{ textDecoration: "none", color: "blue.500" }}>
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#" color="blue.500" fontWeight="semibold">
           Giới thiệu
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
        <Stack spacing={8} align="center">
          <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
            Giới thiệu về BookBuds
          </Heading>
          <Image
            src="https://aeonmall-long-bien.com.vn/wp-content/uploads/2022/01/269302567_4487714621350494_4627200227809060552_n.jpg"
            alt="BookBuds"
            borderRadius="md"
            boxShadow="lg"
            maxW="80%"
          />
          <Divider borderColor="gray.300" />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Chào mừng bạn đến với BookBuds, trang web bán sách trực tuyến hàng
            đầu. Chúng tôi cung cấp một loạt các đầu sách từ nhiều thể loại khác
            nhau, từ văn học cổ điển đến khoa học viễn tưởng, từ sách thiếu nhi
            đến sách chuyên ngành. Sứ mệnh của chúng tôi là mang đến cho bạn
            những trải nghiệm đọc sách tuyệt vời nhất.
          </Text>
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Tại BookBuds, chúng tôi tin rằng sách là nguồn tri thức vô tận và là
            người bạn đồng hành đáng tin cậy trong cuộc sống. Hãy cùng chúng tôi
            khám phá thế giới sách và tìm kiếm những cuốn sách yêu thích của
            bạn.
          </Text>
          <Divider borderColor="gray.300" />
          <Text fontSize="md" textAlign="center" color="gray.500">
            "Một cuốn sách hay là một người bạn thông thái." - G. Whittier
          </Text>
          <Image 
            src="https://file.hstatic.net/1000237375/file/anh_1_02b07ced97f44cdab9e24b5504a7ce9e_grande.png"
            alt="BookBuds"
            borderRadius="md"
            boxShadow="lg"
            maxW="100%"
          />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Đã bao giờ bạn cảm thấy mệt mỏi nhưng chẳng muốn thở than, bạn cảm
            thấy muộn phiền vì một điều gì đó, nhưng lại đè nén, nuốt vào cảm
            xúc của mình và để mặc nó trôi đi. Đã bao giờ bạn muốn biểu lộ ra
            cảm xúc chân thật của mình, nhưng lại tự nhủ thể hiện cảm xúc như
            vậy là không tốt, vì bạn sợ làm mất lòng người khác nên cuối cùng
            lựa chọn cách "mặc kệ" cảm xúc của mình để giữ hòa khí trong mối
            quan hệ, dù bạn đang cảm thấy họ đang khiến bạn tức giận hay buồn
            bã. Trên thực tế, con người đều sẽ có cảm xúc tức giận, nhưng hành
            vi sau khi nảy sinh cảm xúc tức giận của mỗi người là khác nhau. Khi
            học tâm lí học, chúng ta có thể nhận biết và nhìn ra cảm xúc chân
            thực của mình, từ đó có nhiều không gian hơn để đón nhận những cảm
            xúc này, đây chính là tâm thái ung dung điềm đạm, thể hiện sức sống
            tràn trề của chúng ta.
          </Text>
          <Image 
            src="https://file.hstatic.net/1000237375/file/1_f1411cf2ffaf4df08bb185fab0ebd18c_grande.png"
            alt="BookBuds"
            borderRadius="md"
            boxShadow="lg"
            maxW="100%"
          />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
          Lời bài hát "Tiến lên hay lùi" của ca nhạc sĩ Bùi Công Nam và ca sĩ Soobin Hoàng Sơn quả thật đã "chọt" đúng vào trái tim của nhiều bạn trẻ, những bạn còn đang ngây ngất và say sưa trong cơn cảm nắng với người trong mộng.
          </Text>
          <Text fontSize="lg" textAlign="center" maxW="3xl">
          "Làm sao để tiếp cận anh ấy đây?", "Mình nhắn tin cho cô ấy như vậy có bị coi là kém duyên không nhỉ?", "Mình nên tiếp tục hay dừng lại việc theo đuổi ha?", "Nên tỏ tình hay đợi thêm một thời gian nữa?"... Có rất nhiều câu hỏi quay cuồng trong đầu chúng ta và chúng ta chưa thể có câu trả lời thích hợp cho đẹp cả đôi đường.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default About;
