import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    VStack,
    Heading,
    Text,
    Card,
    CardBody,
    Center,
    Stack,
    IconButton,
    Badge,
    Divider,
    useToast
} from '@chakra-ui/react';
import { getMessagesApi, deleteMessageApi, markMessageAsReadApi } from '../../api';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const UserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate=useNavigate();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await getMessagesApi();
            setMessages(response.data.message);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error fetching messages',
                status: 'error',
                duration: 3000,
            });
            setLoading(false);
        }
    };

    const handleMessageClick = async (messageId) => {
        try {
            await markMessageAsReadApi(messageId);
            setMessages(messages.map(msg => 
                msg._id === messageId ? { ...msg, read: true } : msg
            ));
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const handleDelete = async (e, messageId) => {
        e.stopPropagation();
        
        try {
            await deleteMessageApi(messageId);
            setMessages(messages.filter(msg => msg._id !== messageId));
            toast({
                title: 'Message deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error deleting message',
                description: error.response?.data?.message || 'Failed to delete message',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
        return <Text>Loading messages...</Text>;
    }

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6}>
                <Heading>Your Messages</Heading>
                 <Center>
                    <Button variant='solid' colorScheme='purple' onClick={()=>navigate("/dashboard")}>Go To Dashboard</Button>
                 </Center>
                
                {messages.length === 0 ? (
                    <Text>No messages yet</Text>
                ) : (
                    messages.map((msg) => (
                        <Card 
                            key={msg._id} 
                            w="full" 
                            cursor="pointer"
                            onClick={() => handleMessageClick(msg._id)}
                            bg={msg.read ? 'white' : 'purple'}
                        >
                            <CardBody>
                                <Stack spacing={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Text fontWeight="bold">
                                            From: {msg.from.name}
                                        </Text>
                                        {!msg.read && (
                                            <Badge colorScheme="purple">New</Badge>
                                        )}
                                    </Box>
                                    <Divider />
                                    <Text>{msg.message}</Text>
                                    <Text fontSize="sm" color="gray">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </Text>
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            colorScheme="red"
                                            variant="ghost"
                                            size="s"
                                            onClick={(e) => handleDelete(e, msg._id)}
                                            aria-label="Delete message"
                                        />
                                </Stack>
                            </CardBody>
                        </Card>
                    ))
                )}
            </VStack>
        </Container>
    );
};

export default UserMessages;