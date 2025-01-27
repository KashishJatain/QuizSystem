import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  Input,
  useToast,
  Flex,
  Grid,
  Stack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Timer from "../../Components/Timer/Timer";
import { saveTestAttemptApi, getQuestionsApi } from "../../api";
import { AuthContext } from "../../Context/AuthContext";
import { useSelector } from "react-redux";

const Quiz = () => {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const STATUS_COLORS = {
    current: "blue.400",
    answered: "green.400",
    marked: "yellow.400",
    skipped: "red.400",
    unattempted: "gray.300",
  };

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const level = useSelector(state => state.quiz.level);
  const offset = useSelector(state => state.quiz.offset);
  useEffect(() => {
    if (level == 'easy')
      setDuration(300)
    else if (level == 'medium')
      setDuration(360)
    else if (level == 'hard')
      setDuration(400)
  })
  const [loading, setLoading] = useState(false);
  const [organizedQuestions, setOrganizedQuestions] = useState({
    Physics: { mcq: [], numerical: [] },
    Chemistry: { mcq: [], numerical: [] },
    Maths: { mcq: [], numerical: [] }
  });

  const [currentSection, setCurrentSection] = useState('Physics');
  const [currentType, setCurrentType] = useState('mcq');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({
    Physics: { mcq: [], numerical: [] },
    Chemistry: { mcq: [], numerical: [] },
    Maths: { mcq: [], numerical: [] }
  });
  const [questionStatus, setQuestionStatus] = useState({
    Physics: { mcq: [], numerical: [] },
    Chemistry: { mcq: [], numerical: [] },
    Maths: { mcq: [], numerical: [] }
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getQuestionsApi(level, offset);
      const questions = response.data.message;

      setOrganizedQuestions(questions);

      const initialAnswers = {};
      const initialStatus = {};

      ['Physics', 'Chemistry', 'Maths'].forEach(section => {
        initialAnswers[section] = {
          mcq: new Array(questions[section].mcq.length).fill(null),
          numerical: new Array(questions[section].numerical.length).fill(null)
        };
        initialStatus[section] = {
          mcq: new Array(questions[section].mcq.length).fill('unattempted'),
          numerical: new Array(questions[section].numerical.length).fill('unattempted')
        };
      });

      setUserAnswers(initialAnswers);
      setQuestionStatus(initialStatus);
    } catch (error) {
      console.error("Failed to load questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [level]);

  const getCurrentQuestion = () => {
    return organizedQuestions[currentSection]?.[currentType]?.[currentQuestionIndex];
  };

  const handleAnswerSelection = (answer) => {
    const updatedAnswers = { ...userAnswers };
    updatedAnswers[currentSection][currentType][currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);

    const updatedStatus = { ...questionStatus };
    updatedStatus[currentSection][currentType][currentQuestionIndex] = 'answered';
    setQuestionStatus(updatedStatus);
  };

  const handleMarkForReview = () => {
    const updatedStatus = { ...questionStatus };
    const currentStatus = questionStatus[currentSection][currentType][currentQuestionIndex];
    const hasAnswer = !!userAnswers[currentSection][currentType][currentQuestionIndex];

    if (currentStatus === 'marked') {
      updatedStatus[currentSection][currentType][currentQuestionIndex] = hasAnswer ? 'answered' : 'unattempted';
    } else {
      updatedStatus[currentSection][currentType][currentQuestionIndex] = 'marked';
    }

    setQuestionStatus(updatedStatus);
  };

  const handleSubmitQuiz = async () => {
    try {
      const allQuestions = [];
      const allAnswers = [];

      ['Physics', 'Chemistry', 'Maths'].forEach(section => {
        ['mcq', 'numerical'].forEach(type => {
          organizedQuestions[section][type].forEach((question, index) => {
            allQuestions.push({
              ...question,
              section
            });
            allAnswers.push(userAnswers[section][type][index]);
          });
        });
      });

      const result = {
        total_questions: allQuestions.length,
        correct_answer: 0,
        wrong_answer: 0,
        sectionResults: {
          Physics: { correct: 0, wrong: 0, total: 0 },
          Chemistry: { correct: 0, wrong: 0, total: 0 },
          Maths: { correct: 0, wrong: 0, total: 0 }
        }
      };

      allQuestions.forEach((question, index) => {
        const userAnswer = allAnswers[index];
        const section = question.section;
        result.sectionResults[section].total++;

        if (question.type === 'numerical') {
          const numAnswer = Number(userAnswer);
          const numCorrect = Number(question.answer);
          const tolerance = question.tolerance || 0;

          if (userAnswer !== null && Math.abs(numAnswer - numCorrect) <= tolerance) {
            result.correct_answer++;
            result.sectionResults[section].correct++;
          } else if (userAnswer !== null) {
            result.wrong_answer++;
            result.sectionResults[section].wrong++;
          }
        } else {
          if (userAnswer === question.answer) {
            result.correct_answer++;
            result.sectionResults[section].correct++;
          } else if (userAnswer !== null) {
            result.wrong_answer++;
            result.sectionResults[section].wrong++;
          }
        }
      });


      result.percentage = ((result.correct_answer / result.total_questions) * 100).toFixed(2);
      const endTime = Date.now();
      const timeTaken = Math.floor((endTime - startTime) / 1000);

      const testAttemptData = {
        userId: isAuth.user._id,
        level,
        type: "quiz",
        setNumber: offset + 1,
        questions: allQuestions.map((q, index) => ({
          questionId: q._id,
          questionText: q.question,
          questionImage: q.image ? q.image : null,
          correctAnswer: q.answer,
          userAnswer: allAnswers[index],
          isCorrect: q.answer === allAnswers[index]
        })),
        totalScore: (result.correct_answer * 4) - (result.wrong_answer),
        maxMarks: allQuestions.length * 4,
        timeTaken: timeTaken
      };

      try {
        await saveTestAttemptApi(testAttemptData);
      } catch (error) {
        console.error('Failed to save test attempt:', error);
      }

      navigate("/result", {
        state: {
          questions: allQuestions,
          answers: allAnswers,
          result
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        status: "error",
        duration: 3000
      });
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={5}>
      {loading ? (
        <Center h="400px">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>


          <Flex justify="right" width="100%">
            <Text fontSize="larger">Time Remaining:</Text>
            <Timer duration={duration} onTimeUp={handleSubmitQuiz} />
          </Flex>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              {['Physics', 'Chemistry', 'Maths'].map(section => (
                <Button
                  key={section}
                  onClick={() => {
                    setCurrentSection(section);
                    setCurrentType('mcq');
                    setCurrentQuestionIndex(0);
                  }}
                  colorScheme={currentSection === section ? "blue" : "gray"}
                >
                  {section}
                </Button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              {['mcq', 'numerical'].map(type => (
                <Button
                  key={type}
                  onClick={() => {
                    setCurrentType(type);
                    setCurrentQuestionIndex(0);
                  }}
                  colorScheme={currentType === type ? "green" : "gray"}
                >
                  {type.toUpperCase()}
                </Button>
              ))}
            </div>
            <Grid templateColumns="repeat(auto-fit, minmax(40px, 1fr))" gap={2}>
              {organizedQuestions[currentSection]?.[currentType]?.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  bg={
                    currentQuestionIndex === index
                      ? STATUS_COLORS.current
                      : STATUS_COLORS[questionStatus[currentSection][currentType][index]]
                  }
                  size="sm"
                  p={1}
                  minW="25px"
                  height="25px"
                  colorScheme="purple"
                >
                  {index + 1}
                </Button>
              ))}
            </Grid>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              shadow="md"
              minHeight="300px"
              mb={6}
            >
              {getCurrentQuestion() ? (
                <>
                  <Text fontSize="xl" fontWeight="bold" mb={4}>
                    Question {currentQuestionIndex + 1}
                  </Text>
                  <Text fontSize="md" mb={6}>
                    {getCurrentQuestion().question}
                  </Text>


                  {getCurrentQuestion().image && (
                    <img
                      src={`${'http://localhost:4000'}${getCurrentQuestion().image}`}
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

                  {getCurrentQuestion().type === 'mcq' ? (
                    <RadioGroup
                      value={userAnswers[currentSection][currentType][currentQuestionIndex] || ''}
                      onChange={handleAnswerSelection}
                    >
                      <Stack spacing={4}>
                        {getCurrentQuestion().option.map((option, index) => (
                          <Radio key={index} value={option} size="lg">
                            {option}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  ) : (
                    <Input
                      type="number"
                      value={userAnswers[currentSection][currentType][currentQuestionIndex] || ''}
                      onChange={(e) => handleAnswerSelection(e.target.value)}
                      placeholder="Enter your answer"
                      size="lg"
                      w="200px"
                    />
                  )}
                </>
              ) : (
                <Text>No question available.</Text>
              )}
            </Box>

            <Flex justifyContent="space-between" mt={4}>
              <Button
                colorScheme="purple"
                variant="solid"
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                  }
                }}
              >
                Previous
              </Button>
              <Button
                colorScheme={
                  questionStatus[currentSection][currentType][currentQuestionIndex] === 'marked'
                    ? 'orange'
                    : "purple"
                }
                onClick={handleMarkForReview}
              >
                {questionStatus[currentSection][currentType][currentQuestionIndex] === 'marked'
                  ? 'Unmark Review'
                  : 'Mark for Review'}
              </Button>
              <Button
                colorScheme="purple"
                variant="solid"
                onClick={() => {
                  const updatedStatus = { ...questionStatus };
                  updatedStatus[currentSection][currentType][currentQuestionIndex] = 'skipped';
                  setQuestionStatus(updatedStatus);
                  if (currentQuestionIndex < organizedQuestions[currentSection][currentType].length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }
                }}
              >
                Skip & Next
              </Button>
              <Button
                colorScheme="purple"
                variant="solid"
                onClick={() => {
                  if (currentQuestionIndex < organizedQuestions[currentSection][currentType].length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }
                }}
              >
                Next
              </Button>
              <Button colorScheme="green" onClick={handleSubmitQuiz}>
                Submit Quiz
              </Button>
            </Flex>


            <Flex justifyContent="center" alignItems="center" gap={6} mt={8}>
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <Flex key={status} alignItems="center" gap={2}>
                  <Box w={4} h={4} bg={color} borderRadius="md" />
                  <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                </Flex>
              ))}
            </Flex>
          </div>
        </>
      )}
    </Box>
  );
};

export default Quiz;
