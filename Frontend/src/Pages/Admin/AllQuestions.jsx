import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'
import {
  Box, 
  Button, 
  Flex, 
  HStack,
  Select, 
  Table, 
  TableCaption, 
  TableContainer, 
  Tbody, 
  Td, 
  Th, 
  Thead, 
  Tr, 
  useToast,
  Badge,
  VStack
} from "@chakra-ui/react";
import { deleteQuestionApi, getAllQuestionApi } from '../../api';
import Pagination from '../../Components/Pagination/Pagination';
import MyAlert from '../../Components/MyAlert/MyAlert';
import { Link } from 'react-router-dom';

const AllQuestions = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("asc");
  const [section, setSection] = useState("all");
  const [type, setType] = useState("all");
  const [level, setLevel] = useState("all");
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const toast = useToast();

  const getAllQuestion = async (section, type, level, sort, page, limit) => {
    try {
      const res = await getAllQuestionApi(section, type, level, sort, page, limit);
      setData(res.data.message);
      setTotal(res.data.count);
    } catch (error) {
      MyAlert("Failed to fetch questions", "error", toast);
    }
  };

  useEffect(() => {
    getAllQuestion(section, type, level, sort, page, limit);
  }, []);

  const deleteHandler = async (id) => {
    try {
      await deleteQuestionApi(id);
      MyAlert("Question Deleted", "success", toast);
      getAllQuestion(section, type, level, sort, page, limit);
    } catch (error) {
      MyAlert("Failed to delete question", "error", toast);
    }
  };

  const renderQuestionType = (question) => {
    return (
      <VStack align="start" spacing={2}>
        <Badge colorScheme={question.type === 'mcq' ? 'green' : 'blue'}>
          {question.type.toUpperCase()}
        </Badge>
        {question.type === 'numerical' && (
          <Box>
            <strong>Tolerance:</strong> ±{question.tolerance}
          </Box>
        )}
      </VStack>
    );
  };

  return (
    <Box>
      <Sidebar />
      <Flex direction={["column", "row"]} wrap='wrap' gap='15px' justify='center' mt='20px'>
        <Select 
          onChange={(e) => {
            setSection(e.target.value);
            getAllQuestion(e.target.value, type, level, sort, page, limit);
          }} 
          w='150px' 
          bg='#fff'
        >
          <option value="all">All Sections</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Maths">Maths</option>
        </Select>

        <Select 
          onChange={(e) => {
            setType(e.target.value);
            getAllQuestion(section, e.target.value, level, sort, page, limit);
          }} 
          w='150px' 
          bg='#fff'
        >
          <option value="all">All Types</option>
          <option value="mcq">MCQ</option>
          <option value="numerical">Numerical</option>
        </Select>

        <Select 
          onChange={(e) => {
            setLevel(e.target.value);
            getAllQuestion(section, type, e.target.value, sort, page, limit);
          }} 
          w='150px' 
          bg='#fff'
        >
          <option value="all">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
      </Flex>

      <TableContainer>
        <Table variant='styled' bg='#fff' m='20px auto' maxWidth='90%' boxShadow='md'>
          <TableCaption>
            <HStack spacing={5} justify="center">
              <Select 
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  getAllQuestion(section, type, level, sort, page, e.target.value);
                }} 
                w='100px' 
                bg='#fff'
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
              </Select>
              <Pagination 
                total={Math.ceil(total/limit)} 
                page={page} 
                pageHandler={(p) => {
                  setPage(p);
                  getAllQuestion(section, type, level, sort, p, limit);
                }} 
              />
            </HStack>
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Sr.No.</Th>
              <Th>Section</Th>
              <Th>Question</Th>
              <Th>Type</Th>
              <Th>Level</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, ind) => (
              <Tr key={item._id}>
                <Td>{(page - 1) * limit + ind + 1}</Td>
                <Td>{item.section}</Td>
                <Td>{item.question.substring(0, 50)}...</Td>
                <Td>{renderQuestionType(item)}</Td>
                <Td>{item.level}</Td>
                <Td>
                  <Flex>
                    <Link to={`/question/${item._id}`}>
                      <Button size='sm' mr={2} colorScheme="blue">
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      size='sm' 
                      colorScheme="red" 
                      onClick={() => deleteHandler(item._id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllQuestions;