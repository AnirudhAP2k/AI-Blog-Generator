import React, { useContext, useState } from 'react'
import BlogContext from '../context/BlogContext';

const SignUp = () => {
    const context = useContext(BlogContext);
	
	const { userCredentials, setUserCredentials, userSignup, errorNotification} = context;

    const [showWarning, setShowWarning] = useState(false); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if(userCredentials.password === userCredentials.cPassword){
            userSignup();
        } else {
            errorNotification('Please enter correct password');
        }
    }

    const onChange = (e) => {
        const { name, value } = e.target;

        setUserCredentials({
            ...userCredentials,
            [name]: value
        });
        
        if ((name === 'password' || name === 'cPassword')) {
            if (userCredentials.password !== value) {
                setShowWarning(userCredentials.password !== userCredentials.cPassword);
            } else {
                setShowWarning(false);
            }
        }
    };

  return (
    <div className='container text-center'>
      <h1 className='mt-10'>
        SignUp
      </h1>
        <form className='container my-5' id="userSignup" onSubmit={handleSubmit}>
            <div className="input-group my-3">
                <span className="input-group-text">First and Last name</span>
                <input type="text" aria-label="First name" id="firstName" name='firstName' 
                onChange={onChange}
                value={userCredentials.firstName}
                placeholder='"Enter a first name"'
                className="form-control" 
                required/>

                <input type="text" aria-label="Last name" id="lastName" name='lastName'
                onChange={onChange}
                value={userCredentials.lastName}
                placeholder='"Enter a last name"'
                className="form-control" />
            </div>
            <div className="input-group my-3">
                <span className="input-group-text">Email</span>
                <input type="Email" aria-label="Email" id="email" name='email'
                onChange={onChange}
                value={userCredentials.email}
                placeholder='"Enter a valid Name"'
                className="form-control" 
                required />
            </div>
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
            <div className='text-start my-3'>
                <div className="input-group">
                    <span className="input-group-text">Confirm Password</span>
                    <input type="text" aria-label="Confirm Password" id="cPassword" name='cPassword'
                    onChange={onChange}
                    value={userCredentials.cPassword}
                    placeholder='"Enter a valid Name"'
                    className="form-control"
                    required />
                </div>
                {showWarning && (
                <small className='text-danger'>
                    ! Please enter correct password
                </small>
            )}
            </div>
            <div className='mt-5'>
                <button htmlFor="userSignup" type="submit" className="btn btn-outline-primary">SignUp</button>
            </div>
        </form>
    </div>
  )
}

export default SignUp
