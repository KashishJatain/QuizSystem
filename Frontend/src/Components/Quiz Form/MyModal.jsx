import { Button, Text, Select, Stack } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader,ModalFooter,ModalBody } from '@chakra-ui/modal';
import { useState } from 'react';
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import { getQuestion } from '../../Redux/Quiz/quiz.action';
import { setQuizLevel, setQuizOffset } from '../../Redux/Quiz/quiz.action';
import timeConverter from '../TimeConverter/timeConverter';
function MyModal({type, offset, isOpen, setIsOpen}) {
    const [level,setLevel]=useState("");
    const dispatch=useDispatch()
    const [duration,setDuration]=useState(0);
    const navigate=useNavigate()
    const section="all";
    const submitHandler= ()=>{
      if (!level) {
        alert("Please select a difficulty level");
        return;
      }
      dispatch(setQuizLevel(level));  
      dispatch(setQuizOffset(offset));
        dispatch(getQuestion(section, type.toLowerCase(), level, offset));
        navigate("/quiz");
    }
    return (
      <>
        <Modal isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{type} Quiz Form</ModalHeader>
            <ModalBody>
              <Stack fontWeight='600'>
                <Text>Level</Text>    
                <Select 
                  name='level' 
                  onChange={(e) => {
                    setLevel(e.target.value);
                    if (e.target.value === "easy") setDuration(300);
                    else if (e.target.value === "medium") setDuration(360);
                    else if (e.target.value === "hard") setDuration(400);
                    else setDuration(0);
                  }}
                  value={level}
                >
                  <option value="">Select Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
                <Text>Duration: {timeConverter(duration*30)}</Text>    
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button 
                variant='solid' 
                colorScheme='green' 
                onClick={submitHandler}
                isDisabled={!level} 
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  export default MyModal;