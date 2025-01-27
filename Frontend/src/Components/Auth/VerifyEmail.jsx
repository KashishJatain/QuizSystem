import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyApi } from '../../api';
import { Box, VStack, Heading, Text, Spinner } from '@chakra-ui/react';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await verifyApi(token);
                if (response.data.error === false) {
                    setStatus('success');
                    setMessage('Email verified successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage('Verification failed. Please try again or contact support.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={6} p={8} textAlign="center">
                <Heading size="lg">Email Verification</Heading>
                {status === 'verifying' && <Spinner size="xl" color="purple.500" />}
                <Text fontSize="lg">{message}</Text>
            </VStack>
        </Box>
    );
};

export default EmailVerification;