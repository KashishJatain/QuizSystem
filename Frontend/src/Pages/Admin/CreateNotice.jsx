import { Box, Button, Center, Flex, Textarea, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar'
import MyAlert from '../../Components/MyAlert/MyAlert'
import { postNoticeApi } from '../../api';
import style from "../../Components/Auth/Auth.module.css"



const CreateNotice = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const toast=useToast();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const form = { title, content };
        try{
            const res=await postNoticeApi(form);
            MyAlert(res.data.message,'success',toast)
          }catch(error){
            MyAlert(error.response.data.message,'error',toast)
        }
        setTitle("");
        setContent("");
      };

    return (
        <Box>
            <Sidebar/>
        <Box fontWeight='600' w={['95%','80%','50%']} m='20px auto' bg='#fff' p='10px'
        boxShadow='0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
        borderRadius='10px'>
            <Center><h2>Add Notice</h2></Center>
            
            
                <Flex justify='center' align='center' h='90vh'>
        <div id={style.form}>
        <form>
            <Textarea
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
    size="md"
    h="50px" 
    resize="vertical"
    borderColor="gray"
    _hover={{ borderColor: "purple" }}
    focusBorderColor="purple"
/>

            <Textarea
    placeholder="Content"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    required
    size="md"
    h="350px" 
    resize="vertical" 
    borderColor="gray"
    _hover={{ borderColor: "purple" }}
    focusBorderColor="purple"
/>
 
            <Center>
             <Button variant='solid' colorScheme='purple' onClick={handleSubmit}>Post Notice</Button> 
             </Center>
        </form>
        </div>
        </Flex>
        </Box>
        </Box>
    );
};

export default CreateNotice;
