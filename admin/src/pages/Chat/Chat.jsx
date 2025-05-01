import React, { useState, useEffect, useRef } from 'react';
import {
  Layout,
  List,
  Avatar,
  Input,
  Button,
  Badge,
  Card,
  Typography,
} from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { database } from '../../firebase/config';
import { ref, push, onValue, query, orderByChild, equalTo, get } from 'firebase/database';
import axiosClient from '../../apis/axiosClient';

const { Content, Sider } = Layout;
const { Text } = Typography;

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const admin = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Lấy danh sách user từ API
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/users');
        console.log('Users response:', response);
        setUsers(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    console.log('Selected user:', selectedUser);
    console.log('Admin:', admin);

    // Lắng nghe tin nhắn từ Firebase
    const messagesRef = ref(database, 'messages');
    const roomId = `${selectedUser.id}_${admin.id}`;
    console.log('Room ID:', roomId);
    
    const messagesQuery = query(
      messagesRef,
      orderByChild('roomId'), 
      equalTo(roomId)
    );

    console.log('Messages query:', messagesQuery);

    console.log('Listening for messages...');

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      console.log('Messages query triggered');
      const data = snapshot.val();
      if (data) {
        const messageList = Object.values(data);
        console.log('Messages:', messageList);
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
        scrollToBottom();
      } else {
        console.log('No messages found');
        setMessages([]);
      }
    });

    return () => {
      console.log('Unsubscribing from messages...');
      unsubscribe();
      setMessages([]); // Clear messages when changing user
    };
  }, [selectedUser, admin.id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messagesRef = ref(database, 'messages');
    const newMessageData = {
      content: newMessage,
      sender_id: admin.id,
      receiver_id: selectedUser.id,
      roomId: `${selectedUser.id}_${admin.id}`, // Luôn dùng format userId_adminId
      timestamp: Date.now(),
      sender: {
        id: admin.id,
        username: 'Admin'
      }
    };

    try {
      console.log('Sending message:', newMessageData);
      const newRef = await push(messagesRef, newMessageData);
      console.log('Message sent with key:', newRef.key);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '20px' }}>
          <Text strong>Danh sách người dùng</Text>
        </div>
        <List
          dataSource={users}
          renderItem={user => (
            <List.Item
              onClick={() => selectUser(user)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: selectedUser?.id === user.id ? '#e6f7ff' : 'white'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{user.username?.[0]?.toUpperCase()}</Avatar>}
                title={user.username}
                description={user.email}
              />
            </List.Item>
          )}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          {selectedUser ? (
            <Card
              title={`Chat với ${selectedUser.username}`}
              style={{ height: '100%' }}
              bodyStyle={{ height: 'calc(100% - 57px)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender_id === selectedUser.id ? 'flex-start' : 'flex-end',
                      marginBottom: '10px'
                    }}
                  >
                    {message.sender_id === selectedUser.id && (
                      <Avatar style={{ marginRight: '8px' }}>
                        {selectedUser.username[0].toUpperCase()}
                      </Avatar>
                    )}
                    <div
                      style={{
                        backgroundColor: message.sender_id === selectedUser.id ? '#f0f0f0' : '#1890ff',
                        color: message.sender_id === selectedUser.id ? 'black' : 'white',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        maxWidth: '70%'
                      }}
                    >
                      <Text style={{ color: message.sender_id === selectedUser.id ? 'black' : 'white' }}>
                        {message.content}
                      </Text>
                    </div>
                    {message.sender_id === admin.id && (
                      <Avatar style={{ marginLeft: '8px' }}>A</Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onPressEnter={sendMessage}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={sendMessage}
                >
                  Gửi
                </Button>
              </div>
            </Card>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Text>Chọn một người dùng để bắt đầu chat</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat; 