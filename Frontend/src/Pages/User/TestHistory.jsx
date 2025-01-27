import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Select,
    HStack,
    VStack,
    Badge,
    useToast,
    Flex,
    Heading,
    Spinner,
    Card,
    CardBody,
    Grid
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { getTestHistoryApi, getTestAnalyticsApi } from '../../api';

const TestHistory = () => {
    const { isAuth } = useContext(AuthContext);
    const [testHistory, setTestHistory] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        level: 'all',
        page: 1
    });
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchTestHistory();
        fetchAnalytics();
    }, [filters]);

    const fetchTestHistory = async () => {
        try {
            setLoading(true);
            const userId = isAuth.user._id;
            const response = await getTestHistoryApi(userId, filters);

            if (response.data.error) {
                throw new Error(response.data.message);
            }

            const mappedAttempts = response.data.message.attempts.map(attempt => ({
                ...attempt,
                type: attempt.type
            }));

            setTestHistory(mappedAttempts);
            setTotalPages(response.data.message.totalPages);
        } catch (error) {
            toast({
                title: 'Error fetching test history',
                description: error.message || 'Failed to fetch test history',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const userId = isAuth.user._id;
            const response = await getTestAnalyticsApi(userId);

            if (response.data.error) {
                throw new Error(response.data.message);
            }

            const mappedAnalytics = response.data.message.map(stat => ({
                ...stat,
                _id: {
                    ...stat._id,
                    type: stat._id.type || stat._id.type
                }
            }));

            setAnalytics(mappedAnalytics);
        } catch (error) {
            toast({
                title: 'Error fetching analytics',
                description: error.message || 'Failed to fetch analytics',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };



    const handleReview = (attemptId) => {
        navigate(`/quizreview/${attemptId}`);
    };

    const getScoreColor = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'green';
        if (percentage >= 60) return 'yellow';
        return 'red';
    };

    return (
        <Box p={4}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg" textAlign="center" color="purple.600">
                    Test History
                </Heading><Center>
                    <Button
                        variant="solid"
                        colorScheme="purple"
                        onClick={() => navigate("/dashboard")}
                    >
                        Go To Dashboard
                    </Button>
                </Center>

                {analytics && (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                        {analytics.map((stat, index) => (
                            <Card key={index} variant="outline">
                                <CardBody>
                                    <Text fontWeight="bold">{`${stat._id.type} - ${stat._id.level}`}</Text>
                                    <Text>Average Score: {stat.averageScore.toFixed(1)}%</Text>
                                    <Text>Total Attempts: {stat.totalAttempts}</Text>
                                    <Text>Highest Score: {stat.highestScore}</Text>
                                    <Text>Average Time Taken: {Math.floor(stat.averageTimeTaken / 60)}m {stat.averageTimeTaken % 60}s</Text>
                                </CardBody>
                            </Card>
                        ))}
                    </Grid>
                )}

                <HStack spacing={4} justify="center">


                    <Select
                        w="200px"
                        value={filters.level}
                        onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value, page: 1 }))}
                    >
                        <option value="all">All Levels</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </Select>
                </HStack>

                {loading ? (
                    <Center p={8}>
                        <Spinner size="xl" color="purple.500" />
                    </Center>
                ) : (
                    <>
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Date</Th>
                                        <Th>Quiz Type</Th>
                                        <Th>Level</Th>
                                        <Th>Score</Th>
                                        <Th>Time Taken</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {testHistory.map((attempt) => (
                                        <Tr key={attempt._id}>
                                            <Td>{new Date(attempt.completedAt).toLocaleDateString()}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={attempt.type === 'quiz' ? 'green' : 'blue'}
                                                    p={1}
                                                    borderRadius="md"
                                                >
                                                    {(attempt.type || 'quiz').toUpperCase()}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={{
                                                        easy: 'green',
                                                        medium: 'yellow',
                                                        hard: 'red'
                                                    }[attempt.level]}
                                                    p={1}
                                                    borderRadius="md"
                                                >
                                                    {attempt.level}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Text
                                                    fontWeight="bold"
                                                    color={getScoreColor(attempt.totalScore, attempt.maxMarks)}
                                                >
                                                    {attempt.totalScore}/{attempt.maxMarks}
                                                </Text>
                                            </Td>
                                            <Td>{Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s</Td>
                                            <Td>
                                                <Button
                                                    size="sm"
                                                    colorScheme="purple"
                                                    onClick={() => handleReview(attempt._id)}
                                                >
                                                    Review
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>

                        <Flex justify="center" mt={4}>
                            <HStack>
                                <Button
                                    size="sm"
                                    colorScheme="purple"
                                    isDisabled={filters.page === 1}
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                >
                                    Previous
                                </Button>
                                <Text>
                                    Page {filters.page} of {totalPages}
                                </Text>
                                <Button
                                    size="sm"
                                    colorScheme="purple"
                                    isDisabled={filters.page === totalPages}
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                >
                                    Next
                                </Button>
                            </HStack>
                        </Flex>


                    </>
                )}
            </VStack>
        </Box>
    );
};

export default TestHistory;