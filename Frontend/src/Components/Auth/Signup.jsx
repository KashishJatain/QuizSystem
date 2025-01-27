import { Button, Heading, Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/toast'
import React, { useState } from 'react'
import { signupApi } from '../../api'
import MyAlert from '../MyAlert/MyAlert'
import style from "./Auth.module.css";
import { useNavigate } from 'react-router-dom'

const init = {
    name: "",
    email: "",
    password: ""
}

const Signup = ({setToggel}) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [creds, setCreds] = useState(init);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        const {name, value} = e.target;
        setCreds(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const validateForm = () => {
        if (!creds.name || !creds.email || !creds.password) {
            MyAlert('Please fill in all fields', 'error', toast);
            return false;
        }
        if (!creds.email.includes('@')) {
            MyAlert('Please enter a valid email', 'error', toast);
            return false;
        }
        if (creds.password.length < 6) {
            MyAlert('Password must be at least 6 characters', 'error', toast);
            return false;
        }
        return true;
    }

    const submitHandler = async (e) => {
        e.preventDefault(); 
        
        if (!validateForm()) return;

        try {
            setLoading(true);
            const res = await signupApi(creds);
            
            if (res.data.error === false) {
                MyAlert(res.data.message,'success',toast)
                setCreds(init);
                e.target.reset();
            } else {
                MyAlert(res.data.message, 'error', toast);
            }
        } catch (error) {
            MyAlert(error.response?.data?.message || 'Signup failed', 'error', toast);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div id={style.form}>
            <Heading>Signup</Heading>
            <form onSubmit={submitHandler}>
                <label>Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={creds.name}
                    onChange={changeHandler}
                    required 
                    minLength="2"
                />    
                <label>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={creds.email}
                    onChange={changeHandler}
                    required 
                />    
                <label>Create Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={creds.password}
                    onChange={changeHandler}
                    required 
                    minLength="6"
                />
                <Button 
                    type="submit"
                    isLoading={loading} 
                    variant="solid" 
                    colorScheme="purple"
                    disabled={loading}
                >
                    Signup
                </Button>
            </form>
            <div className={style.formobile}>
                <Text mt="20px">
                    Have an account?
                    <span onClick={() => setToggel(false)}>Login</span>
                </Text>
            </div>
        </div>
    )
}

export default Signup;