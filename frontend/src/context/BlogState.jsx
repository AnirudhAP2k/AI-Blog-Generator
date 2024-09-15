import React, { useState } from 'react'
import BlogContext from './BlogContext';
import axios from 'axios';

const BlogState = (props) => {
    const host = process.env.REACT_APP_HOST;
    const [link, setLink] = useState([]);
    const [blogContent, setBlogContent] = useState([]);
	const [generateDisable, setGenerateDisable] = useState(false);
    
    const createBlog = async() => {
        setGenerateDisable(true);
        await axios
                .post(`${host}/api/create`, {link: link}, {
                    headers:{
                        'Content-Type': 'application/json',
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
    return (
        <div>
            <BlogContext.Provider value={{link, blogContent, generateDisable, setLink, createBlog}}>
                {props.children}
            </BlogContext.Provider>
        </div>
    )
}

export default BlogState
