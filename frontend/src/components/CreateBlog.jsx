import React, { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/BlogContext';

const CreateBlog = () => {
	const context = useContext(BlogContext);
	
	const { link, setLink, generateDisable, createBlog, blogContent } = context;
	const [videoLink, setVideoLink] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		setLink(videoLink);
	}

	useEffect(()=>{
		if(link.length){
			createBlog();
		}
		// eslint-disable-next-line
	}, [link])

	return (
      <div className="col-8 mx-auto card rounded shadow-lg mt-5 p-5">
		<div className='text-center col-8 mx-auto'>
			<h1>Welcome to Blog Generator</h1>
			<p>Generate the high quality blog using the AI. Simply enter the link of the youtube video to generate the blog related to the video. Thanks!</p>
		</div>
		<form onSubmit={handleSubmit}>
			<h5 className="text-start">Enter the youtube link</h5>
            <div className="input-group mt-3">
                <input type="url" className="form-control" id="videoLink" name="videoLink" placeholder="https://xyz.com" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} required/>
				<button className="btn btn-outline-primary" type="submit" value="Submit" disabled={generateDisable}>Generate</button>
            </div>
			<div className='mt-5'>
				<h4>Generated Blog</h4>
				<div className="mt-2" id="generated_blog" dangerouslySetInnerHTML={{ __html: blogContent }}></div>
			</div>
        </form>
      </div>
    )
  }

  export default CreateBlog
