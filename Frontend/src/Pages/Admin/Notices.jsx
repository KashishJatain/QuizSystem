import { Box, Button, Heading, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { getNoticesApi,deleteNoticeApi } from '../../api';
import { useNavigate } from 'react-router-dom';
import style from "../../Components/Auth/Auth.module.css"

const Noticeboard = () => {
    const navigate=useNavigate();
    const [notices, setNotices] = useState([]);
    const toast=useToast();
    const getNotices=async()=>{
        const res=await getNoticesApi();
        setNotices(res.data.message);
    };
        const handleDelete = async (id) => {
            try {
                const response = await deleteNoticeApi(id);
                
                if (response.data && !response.data.error) {
                    toast({
                        title: 'Success',
                        description: 'Notice deleted successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    getNotices(); 
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || 'Failed to delete notice',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        };

    useEffect(()=>{
        getNotices();
      },[])

    return (
        <Box display="flex" minH="100vh">
                <Sidebar />

            <Box flex="1" p={6} className={style.form}>
                <Heading as="h2" size="lg" mb={6} color="blue" textAlign="center">
                    Noticeboard
                </Heading>
                <VStack align="start" spacing={6}>
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <Box
                                key={notice._id}
                                p={4}
                                border="1px"
                                borderColor="gray"
                                borderRadius="md"
                                bg="white"
                                w="100%"
                                boxShadow="sm"
                                position="relative"
                            >
                                <Heading as="h3" size="md" mb={2} color="blue">
                                    {notice.title}
                                </Heading>
                                <Text color="gray">{notice.content}</Text>
                                <Text fontSize="sm" color="gray" mt={2}>
                                    {new Date(notice.createdAt).toLocaleString()}
                                </Text>
                        <Button
                            position="absolute"
                            top="4"
                            right="4"
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(notice._id)}
                        >
                            Delete
                        </Button>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray" textAlign="center">
                            No notices available.
                        </Text>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default Noticeboard;


