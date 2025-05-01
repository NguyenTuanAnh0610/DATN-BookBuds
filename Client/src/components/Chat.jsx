import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { database } from '../firebase/config';
import { ref, push, onValue, query, orderByChild, equalTo } from 'firebase/database';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const adminId = 1; // ID của admin

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Lắng nghe tin nhắn từ Firebase
    const messagesRef = ref(database, 'messages');
    const userMessagesQuery = query(
      messagesRef,
      orderByChild('roomId'),
      equalTo(`${user.id}_${adminId}`)
    );
   
    const unsubscribe = onValue(userMessagesQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
        scrollToBottom();
      }
    });

    return () => unsubscribe();
  }, [user.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagesRef = ref(database, 'messages');
    const newMessageData = {
      content: newMessage,
      sender_id: user.id,
      receiver_id: adminId,
      roomId: `${user.id}_${adminId}`,
      timestamp: Date.now(),
      sender: {
        id: user.id,
        username: user.username
      }
    };

    try {
      await push(messagesRef, newMessageData);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      width="300px"
      height={isMinimized ? "40px" : "400px"}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.2s ease"
    >
      {isMinimized ? (
        <Box
          w="full"
          p={2}
          bg="blue.500"
          color="white"
          borderRadius="lg"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          cursor="pointer"
          onClick={toggleMinimize}
        >
          <Text fontWeight="bold">Chat với Admin</Text>
          <ChevronUpIcon />
        </Box>
      ) : (
        <VStack h="full" spacing={0}>
          <Box
            w="full"
            p={3}
            borderBottom="1px"
            borderColor={borderColor}
            bg="blue.500"
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            cursor="pointer"
            onClick={toggleMinimize}
          >
            <Text fontWeight="bold">Chat với Admin</Text>
            <ChevronDownIcon />
          </Box>

          <VStack
            flex={1}
            w="full"
            p={3}
            overflowY="auto"
            spacing={3}
            alignItems="stretch"
            display={isMinimized ? "none" : "flex"}
          >
            {messages.map((message, index) => (
              <HStack
                key={index}
                alignSelf={message.sender_id === user.id ? 'flex-end' : 'flex-start'}
                maxW="80%"
              >
                {message.sender_id !== user.id && (
                  <Avatar size="sm" name="Admin" />
                )}
                <Box
                  bg={message.sender_id === user.id ? 'blue.500' : 'gray.100'}
                  color={message.sender_id === user.id ? 'white' : 'black'}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text fontSize="sm">{message.content}</Text>
                </Box>
              </HStack>
            ))}
            <div ref={messagesEndRef} />
          </VStack>

          <HStack 
            w="full" 
            p={3} 
            borderTop="1px" 
            borderColor={borderColor}
            display={isMinimized ? "none" : "flex"}
          >
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <IconButton
              colorScheme="blue"
              aria-label="Send message"
              icon={<ArrowForwardIcon />}
              onClick={sendMessage}
            />
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default Chat;