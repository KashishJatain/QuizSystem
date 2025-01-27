import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Spinner,
  useToast,
  VStack,
  Center,
  Divider,
  Flex
} from '@chakra-ui/react';
import { getBookmarkedQuestions, unbookmarkApi } from '../../api';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    try {
      const response = await getBookmarkedQuestions();
      setBookmarks(response.data.message);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookmarks');
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookmarks',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleUnbookmark = async (questionId) => {
    try {
      await unbookmarkApi(questionId);
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== questionId));
      toast({
        title: 'Success',
        description: 'Question unbookmarked successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to unbookmark question',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderQuestionContent = (question) => {
    if (question.type === 'numerical') {
      return (
        <VStack align="stretch" spacing={3}>
          <Text fontWeight="bold" mb={2}>
            {question.question}
          </Text>{question.image && (
            <img
              src={`${'http://localhost:4000'}${question.image}`}
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
          <Box borderRadius="md" p={3} bg="gray.50">
            <Text fontWeight="medium" mb={2}>
              Answer: {question.answer}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Acceptable range: ±{(question.tolerance * 100).toFixed(0)}%
            </Text>
          </Box>
        </VStack>
      );
    }
    return (
      <VStack align="stretch" spacing={2}>
        <Text fontWeight="bold" mb={2}>
          {question.question}
        </Text>
        {question.image && (
          <img
            src={`${'http://localhost:4000'}${question.image}`}
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
        {question.option.map((opt, index) => (
          <Text
            key={index}
            p={2}
            bg={opt === question.answer ? 'green.100' : 'gray.50'}
            borderRadius="md"
          >
            {opt}
          </Text>
        ))}
      </VStack>
    );
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text fontSize="xl">No bookmarks found</Text>
          <Text color="gray.500">Questions you bookmark will appear here</Text>
          <Button variant='solid' colorScheme='purple' onClick={() => navigate("/dashboard")}>
            Go To Dashboard
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center" color="purple.600" mb={6}>
          Your Bookmarked Questions
        </Heading>
        <Button variant='solid' colorScheme='purple' onClick={() => navigate("/dashboard")}>
          Go To Dashboard
        </Button>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {bookmarks.map((question) => (
            <Card key={question._id} variant="outline" boxShadow="md">
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>

                    <Badge ml={2} colorScheme={question.type === 'mcq' ? 'blue' : 'orange'}>
                      {question.type.toUpperCase()}
                    </Badge>
                  </Box>
                  <Badge colorScheme="purple">{question.section}</Badge>
                </Flex>
              </CardHeader>

              <CardBody>
                {renderQuestionContent(question)}
              </CardBody>

              <Divider />

              <CardFooter>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  width="full"
                  onClick={() => handleUnbookmark(question._id)}
                >
                  Remove Bookmark
                </Button>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Bookmarks;