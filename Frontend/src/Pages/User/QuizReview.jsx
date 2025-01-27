import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Badge,
    Spinner,
    Card,
    CardBody,
    Button,
    useToast,
    Divider,
    HStack,
    Icon,
    Container
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { getTestAttemptDetailsApi } from '../../api';

const QuizReview = () => {
    const { attemptId } = useParams();
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchAttemptDetails();
    }, [attemptId]);

    const fetchAttemptDetails = async () => {
        try {
            const response = await getTestAttemptDetailsApi(attemptId)
            setAttempt(response.data.message);
        } catch (error) {
            toast({
                title: 'Error fetching attempt details',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const getLevelBadgeColor = (level) => {
        const colors = {
            easy: 'green',
            medium: 'yellow',
            hard: 'red'
        };
        return colors[level] || 'gray';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                <Spinner size="xl" color="purple.500" />
            </Box>
        );
    }

    if (!attempt) {
        return (
            <Box textAlign="center" py={10}>
                <Text>No attempt data found</Text>
                <Button mt={4} onClick={() => navigate('/test-history')}>
                    Back to History
                </Button>
            </Box>
        );
    }

    return (
        <Container maxW="4xl" py={8}>
            <VStack spacing={6} align="stretch">
                <Box textAlign="center">
                    <Heading size="lg" color="purple.600" mb={2}>
                        Quiz Review
                    </Heading>
                    <HStack justify="center" spacing={4}>
                        <Badge colorScheme={getLevelBadgeColor(attempt.level)} px={2} py={1}>
                            {(attempt.level || "medium").toUpperCase()}
                        </Badge>
                        <Badge colorScheme="purple" px={2} py={1}>
                            Score: {attempt.totalScore}/{attempt.maxMarks}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                            Time: {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                        </Text>
                    </HStack>
                </Box>

                <Divider />

                <VStack spacing={4} align="stretch">
                    {attempt.questions.map((question, index) => (
                        <Card key={index} variant="outline">
                            <CardBody>
                                <VStack align="stretch" spacing={3}>
                                    <HStack justify="space-between">
                                        <Text fontWeight="bold">
                                            Question {index + 1}
                                        </Text>
                                        <HStack>
                                            {question.isCorrect ? (
                                                <Icon as={CheckCircle} color="green.500" />
                                            ) : (
                                                <Icon as={XCircle} color="red.500" />
                                            )}
                                            <Badge colorScheme={question.isCorrect ? 'green' : 'red'}>
                                                {question.score} points
                                            </Badge>
                                        </HStack>
                                    </HStack>

                                    <Text>{question.questionText}</Text>
                                    {question.questionImage && (
                                        <img
                                            src={`${'http://localhost:4000'}${question.questionImage}`}
                                            alt="Uploaded Image"
                                            style={{
                                                maxWidth: '100%',
                                                height: 'auto',
                                                marginTop: '10px',
                                                objectFit: 'contain',
                                                maxHeight: '300px',
                                            }}
                                        />
                                    )}

                                    <Box pl={4}>
                                        <Text color={question.userAnswer === question.correctAnswer ? 'green.600' : 'red.600'}>
                                            Your Answer: {question.userAnswer}
                                        </Text>
                                        {question.userAnswer !== question.correctAnswer && (
                                            <Text color="green.600">
                                                Correct Answer: {question.correctAnswer}
                                            </Text>
                                        )}
                                    </Box>
                                </VStack>
                            </CardBody>
                        </Card>
                    ))}
                </VStack>

                <Box textAlign="center" pt={4}>
                    <Button
                        colorScheme="purple"
                        onClick={() => navigate('/test-history')}
                    >
                        Back to History
                    </Button>
                </Box>
            </VStack>
        </Container>
    );
};

export default QuizReview;