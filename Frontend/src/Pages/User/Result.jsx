import React from 'react';
import { 
  Box, 
  Button, 
  VStack, 
  Heading, 
  Text, 
  SimpleGrid, 
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { questions, answers, result } = location.state || {};

  const calculateSectionPerformance = () => {
    if (!questions || !answers || !result) return [];

    return ['Physics', 'Chemistry', 'Maths'].map(section => {
      const sectionResult = result.sectionResults[section];
      return {
        section,
        totalQuestions: sectionResult.total,
        correctAnswers: sectionResult.correct,
        percentage: sectionResult.total > 0 
          ? (sectionResult.correct / sectionResult.total) * 100 
          : 0
      };
    });
  };

  const sectionPerformance = calculateSectionPerformance();

  if (!questions || !answers || !result) {
    return (
      <Center h="100vh">
        <Text>No result data available</Text>
      </Center>
    );
  }

  return (
    <Box p={8}>
      <VStack spacing={6}>
        <Heading>Quiz Result</Heading>
        
        <Stat>
          <StatLabel>Total Score</StatLabel>
          <StatNumber>
            {result.correct_answer*4-result.wrong_answer} / {result.total_questions*4}
          </StatNumber>
          <StatHelpText>
            Percentage: {result.percentage}%
          </StatHelpText>
        </Stat>
=
        <SimpleGrid columns={3} spacing={4} width="full">
          {sectionPerformance.map((section, index) => (
            <Box 
              key={index} 
              borderWidth={1} 
              borderRadius="lg" 
              p={4} 
              textAlign="center"
              bg={section.percentage >= 60 ? 'green.100' : section.percentage >= 40 ? 'yellow.100' : 'red.100'}
            >
              <Text fontWeight="bold" textTransform="capitalize">
                {section.section}
              </Text>
              <Text>
                {section.correctAnswers} / {section.totalQuestions}
              </Text>
              <Text fontSize="sm">
                {section.percentage.toFixed(2)}%
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Center mt={6} gap={4}>
          <Button 
            colorScheme="purple" 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
          <Button 
            colorScheme="green" 
            onClick={() => navigate("/review", { 
              state: { questions, answers, result } 
            })}
          >
            Review Answers
          </Button>
        </Center>
      </VStack>
    </Box>
  );
};


export default Result;