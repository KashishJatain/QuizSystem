import React, { useState, useEffect } from 'react';
import {
    Box,
    Select,
    VStack,
    Heading,
    Spinner,
    Center,
    useToast
} from '@chakra-ui/react';
import Testhistory from './TestHistory';
import { getAllUserApi } from '../../api';
import Sidebar from '../../Components/Sidebar/Sidebar';

const UserHistory = () => {
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
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
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={4}>
            <Sidebar />
            <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="center" color="purple.600">
                    User Test History
                </Heading>

                {loading ? (
                    <Center p={8}>
                        <Spinner size="xl" color="purple.500" />
                    </Center>
                ) : (
                    <>
                        <Select
                            placeholder="Select a user"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full max-w-md mx-auto mb-6"
                        >
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.name}
                                </option>
                            ))}
                        </Select>

                        {selectedUser && (
                            <Testhistory userId={selectedUser} />
                        )}
                    </>
                )}
            </VStack>
        </Box>
    );
};

export default UserHistory;