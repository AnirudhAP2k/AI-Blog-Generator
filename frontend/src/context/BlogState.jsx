import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BlogContext from './BlogContext';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const BlogState = (props) => {
    const host = process.env.REACT_APP_HOST;
    const port = process.env.REACT_APP_PORT;
    const [link, setLink] = useState([]);
    const [blogContent, setBlogContent] = useState([]);
    const [userCredentials, setUserCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        cPassword: ""
    });
	const [generateDisable, setGenerateDisable] = useState(false);
    
    let signupData = {};
    let loginData = {};

    const navigate = useNavigate()

    const successNotification = (message) => {
        toast.success(message, {
            position: 'top-right',
            theme: 'colored',
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: false
        });
    };

    const errorNotification = (message) => {
        toast.error(message, {
          position: 'top-right',
          theme: 'colored',
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: false
        });
    };

    const hashPassword = (password) => {
        return CryptoJS.SHA256(password).toString();
    };

    const createBlog = async() => {
        setGenerateDisable(true);
        await axios
                .post(`${host}:${port}/api/create`, {link: link}, {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
                    }
                })
                .then((res)=>{
                    setBlogContent(res.data.blogContent);
                })
                .catch((error)=>{
                    console.log(error);
                })
                .finally(()=>{
                    setGenerateDisable(false);
                    setLink([]);
                })
    }

    const userSignup = async() => {
        const { cPassword, ...userSignupCredentials } = userCredentials;

        if(userSignupCredentials.password){
            const hashedPassword = hashPassword(userSignupCredentials.password);
            signupData = {
                ...userSignupCredentials,
                password: hashedPassword
            };
        }

        await axios
                .post(`${host}:${port}/api/signup`, signupData, {
                    headers:{
                        'Content-Type': 'application/json',
                    }
                })
                .then((res)=>{
                    successNotification(res.data.message ?? "Signup Successfull!!");
                    setUserCredentials({});
                    navigate('/login');
                    
                })
                .catch((error)=>{
                    errorNotification(error.response.data.error ?? "Signup Unsuccessful!!")
                    console.log(error);
                })
    }

    const userLogin = async() => {
        const { firstName, lastName, email, cPassword, ...userLoginCredentials } = userCredentials;

        if(userLoginCredentials.password){
            const hashedPassword = hashPassword(userLoginCredentials.password);
            loginData = {
                ...userLoginCredentials,
                password: hashedPassword
            };
        }

        await axios
                .post(`${host}:${port}/api/login`, loginData, {
                    headers:{
                        'Content-Type': 'application/json',
                    }
                })
                .then((res)=>{
                    successNotification(res.data.message ?? "Login Successfull!!");
                    setUserCredentials({});
                    sessionStorage.setItem('access_token', res.data.success.access);
                    navigate('/');
                })
                .catch((error)=>{
                    errorNotification(error.response.data.error ?? "Login Unsuccessful!!")
                    console.log(error);
                })
    }

    return (
        <div>
            <BlogContext.Provider value={{link, blogContent, generateDisable, userCredentials, navigate, successNotification, errorNotification, setUserCredentials, setLink, createBlog, userSignup, userLogin }}>
                {props.children}
            </BlogContext.Provider>
        </div>
    )
}

export default BlogState
