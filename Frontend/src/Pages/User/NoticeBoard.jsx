import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getNoticesApi } from '../../api';
import { useNavigate } from 'react-router-dom';

const Noticeboard = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const getNotices = async () => {
        const res = await getNoticesApi();
        setNotices(res.data.message);
    };

    useEffect(() => {
        getNotices();
    }, [])

    return (
        <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
            <Heading as="h2" size="lg" textAlign="center" mb={6} color="purple.600">
                Noticeboard
            </Heading>
            <Center mt={8}>
                <Button variant="solid" colorScheme="purple" size="lg" onClick={() => navigate("/dashboard")}>Go To Dashboard</Button>
            </Center>
            <VStack align="start" spacing={6}>
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <Box key={notice._id} p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white" w="100%" boxShadow="sm"
                        >
                            <Heading as="h3" size="md" mb={2} color="purple.700">
                                {notice.title}
                            </Heading>
                            <Text color="gray.700">{notice.content}</Text>
                            <Text fontSize="sm" color="gray.500" mt={2}>
                                {new Date(notice.createdAt).toLocaleString()}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text color="gray.500" textAlign="center">
                        No notices available.
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default Noticeboard;


