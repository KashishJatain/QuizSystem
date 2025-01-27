import React, { useState, useEffect } from 'react';
import {
    Container,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    Select,
    useToast
} from '@chakra-ui/react';
import { getAllUserApi, sendMessageApi } from '../../api';
import Sidebar from '../../Components/Sidebar/Sidebar'

const AdminMessages = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getAllUserApi();
            const nonAdminUsers = response.data.message.filter(user => !user.isAdmin);
            setUsers(nonAdminUsers);
        } catch (error) {
            toast({
                title: 'Error fetching users',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser || !message) {
            toast({
                title: 'Please fill all fields',
                status: 'warning',
                duration: 3000,
            });
            return;
        }

        setLoading(true);
        try {
            await sendMessageApi({
                to: selectedUser,
                message: message
            });
            
            toast({
                title: 'Message sent successfully',
                status: 'success',
                duration: 3000,
            });
            
            setMessage('');
            setSelectedUser('');
        } catch (error) {
            toast({
                title: 'Error sending message',
                status: 'error',
                duration: 3000,
            });
        }
        setLoading(false);
    };

    return (
        <><Sidebar/>
        <Container maxW="container.md" py={8}>
            
            <VStack spacing={6}>
                <Heading>Send Message to Student</Heading>
                
                <FormControl>
                    <FormLabel>Select Student</FormLabel>
                    <Select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        placeholder="Select student"
                    >
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.name} 
                            </option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message here"
                        rows={5}
                    />
                </FormControl>

                <Button
                    colorScheme="purple"
                    onClick={handleSubmit}
                    isLoading={loading}
                    width="full"
                >
                    Send Message
                </Button>
            </VStack>
        </Container>
        </>
    );
};

export default AdminMessages;