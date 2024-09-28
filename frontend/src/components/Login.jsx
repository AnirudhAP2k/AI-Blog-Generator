import React, { useContext } from 'react'
import BlogContext from '../context/BlogContext';


const Login = () => {
  const context = useContext(BlogContext);
	
	const { userCredentials, setUserCredentials, userLogin } = context;

    const handleSubmit = (e) => {
        e.preventDefault();
        userLogin();
    }

    const onChange = (e) => {
        const { name, value } = e.target;

        setUserCredentials({
            ...userCredentials,
            [name]: value
        });
    };

  return (
    <div className='container text-center'>
      <h1 className='mt-10'>
        Login
      </h1>
        <form className='container my-5' id="userLogin" onSubmit={handleSubmit}>
            <div className="input-group my-3">
                <span className="input-group-text">Username</span>
                <input type="text" aria-label="Username" id="username" name='username'
                onChange={onChange}
                value={userCredentials.username}
                placeholder='"Enter a valid username"'
                className="form-control" 
                required />
            </div>
            <div className="input-group my-3">
                <span className="input-group-text">Password</span>
                <input type="text" aria-label="Password" id="password" name='password'
                onChange={onChange}
                value={userCredentials.password}
                placeholder='"Enter a valid Name"'
                className="form-control" 
                required />
            </div>
            <div className='mt-5'>
                <button htmlFor="userLogin" type="submit" className="btn btn-outline-primary">Login</button>
            </div>
        </form>
    </div>
  )
}

export default Login
