import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  useToast
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookmarkApi, unbookmarkApi } from '../../api';

const Review = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const { questions, answers, result } = location.state || {};
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});

  const isAnswerCorrect = (question, userAnswer) => {
    if (question.type === 'mcq') {
      return question.answer === userAnswer;
    }

    if (question.type === 'numerical') {
      return Math.abs(parseFloat(question.answer) - parseFloat(userAnswer)) <= question.tolerance;
    }

    return false;
  };

  const handleBookmark = async (question) => {
    try {
      const questionId = question._id;
      if (bookmarkedQuestions[questionId]) {
        await unbookmarkApi(questionId);
        toast({
          title: "Bookmark Removed",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        await bookmarkApi(questionId);
        toast({
          title: "Question Bookmarked",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }

      setBookmarkedQuestions(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
    } catch (error) {
      toast({
        title: "Bookmark Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const organizeQuestionsBySectionsAndTypes = () => {
    const sections = ['Physics', 'Chemistry', 'Maths'];
    const types = ['mcq', 'numerical'];

    return sections.map(section => ({
      name: section,
      types: types.map(type => ({
        name: type,
        questions: questions.filter(q => q.section === section && q.type === type)
      }))
    }));
  };

  const sectionizedQuestions = organizeQuestionsBySectionsAndTypes();

  return (
    <Box p={8}>
      <VStack spacing={6}>
        <Heading>Detailed Answer Review</Heading>

        {sectionizedQuestions.map((section, sectionIndex) => (
          <Box key={sectionIndex} width="full">
            <Heading size="md" mb={4} textTransform="capitalize">
              {section.name} Section
            </Heading>
            {section.types.map((type, typeIndex) => (
              <Box key={typeIndex} mb={4}>
                <Heading size="sm" mb={2} textTransform="capitalize">
                  {type.name} Questions
                </Heading>
                <Accordion allowMultiple width="full">
                  {type.questions.map((question, questionIndex) => {
                    const globalIndex = questions.indexOf(question);

                    return (
                      <AccordionItem key={globalIndex}>
                        <AccordionButton>
                          <Flex flex="1" textAlign="left" alignItems="center">
                            <Text mr={2}>
                              Question {globalIndex + 1}
                            </Text>
                            <Badge
                              colorScheme={
                                isAnswerCorrect(question, answers[globalIndex])
                                  ? 'green'
                                  : 'red'
                              }
                            >
                              {isAnswerCorrect(question, answers[globalIndex]) ? 'Correct' : 'Incorrect or Skipped'}
                            </Badge>
                          </Flex>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <VStack align="stretch" spacing={3}>
                            <Text fontWeight="bold">{question.question}</Text>
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
                            {question.type === 'mcq' && (
                              <VStack align="stretch">
                                {question.option.map((opt, optIndex) => (
                                  <Text
                                    key={optIndex}
                                    bg={
                                      opt === question.answer
                                        ? 'green.100'
                                        : opt === answers[globalIndex]
                                          ? 'red.100'
                                          : 'gray.50'
                                    }
                                    p={2}
                                    borderRadius="md"
                                  >
                                    {opt}
                                  </Text>
                                ))}
                              </VStack>
                            )}

                            {question.type === 'numerical' && (
                              <Box>
                                <Text>
                                  Your Answer: {answers[globalIndex]}
                                </Text>
                                <Text>
                                  Correct Answer: {question.answer}
                                </Text>
                                <Text color="gray.500">
                                  Acceptable Range: ±{question.tolerance}
                                </Text>
                              </Box>
                            )}



                            <Button
                              onClick={() => handleBookmark(question)}
                              colorScheme={bookmarkedQuestions[question._id] ? 'red' : 'blue'}
                            >
                              {bookmarkedQuestions[question._id] ? 'Unbookmark' : 'Bookmark'}
                            </Button>
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </Box>
            ))}
          </Box>
        ))}

        <Flex justify="center" gap={4}>
          <Button
            colorScheme="purple"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button
            colorScheme="green"
            onClick={() => navigate("/test-history")}
          >
            View Test History
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Review;