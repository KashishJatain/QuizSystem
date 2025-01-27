import { Box, Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import MyModal from '../Quiz Form/MyModal'

const Topicard = ({topic, offset}) => {
  const [isOpen,setIsOpen]=useState(false);
  return (
   <Box p='10px'
   bg='#fff'
   width="100%"
   boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
   >
    <Flex direction={["column","column","row"]} gap='10px'>
   
   <Flex direction='column' justify='space-around' gap='20px'>
   <Heading size='md'>{topic} Quiz</Heading>
   <Button variant='solid' colorScheme='purple' onClick={()=>setIsOpen(true)}>Start</Button>
   </Flex>
    </Flex>
    <MyModal type={topic} offset={offset} isOpen={isOpen} setIsOpen={setIsOpen} />
   </Box>
  )
}

export default Topicard