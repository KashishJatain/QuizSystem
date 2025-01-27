import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
const Navbar = () => {
const {isAuth,setIsAuth}=useContext(AuthContext);
const navigate=useNavigate();
return (
    <Flex
    justify="space-between"
    align="center"
    p="0 20px"
    h="60px"
    boxShadow="0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)"
    >
        <Text fontSize='3xl'>QuizSystem</Text>
    <Menu>
        <MenuButton as={Button} h="50px" w="50px" p="0" borderRadius="50%">
        <Avatar name={isAuth?.user?.name} />
        </MenuButton>
        <MenuList>
        <MenuItem onClick={()=>navigate("/noticeboard")}>NoticeBoard</MenuItem>
        <MenuItem onClick={()=>navigate("/bookmarks")}>Bookmarks</MenuItem>
        <MenuItem onClick={()=>navigate("/user-messages")}>Messages</MenuItem>
        <MenuItem onClick={()=>navigate("/test-history")}>Test History</MenuItem>
        <MenuItem onClick={()=>setIsAuth({isAuth:false,user:{}})}>Logout</MenuItem>
        </MenuList>
    </Menu>
    </Flex>
);
};

export default Navbar;