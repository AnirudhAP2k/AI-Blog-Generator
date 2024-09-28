import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import BlogContext from '../context/BlogContext';

const Navbar = () => {
  const context = useContext(BlogContext);
	
	const { navigate } = context;

  const access_token = sessionStorage.getItem('access_token');

  const handleCLick = () => {
    sessionStorage.removeItem('access_token');
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <Link className="navbar-brand" to="#">AI Blog Generator</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarScroll">
              <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                  <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="#">Home</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link disabled" aria-disabled="true">Link</Link>
                  </li>
              </ul>
              {access_token ? (
                <div className='mx-2'>
                <Link to='/login'>
                  <button type="button" className="btn btn-outline-success" onClick={handleCLick}>Logout</button>
                </Link>
              </div>) :
                (<div className='d-flex justify-content-center align-items-center'>
                  <div className='mx-2'>
                      <Link to='/login'>
                        <button type="button" className="btn btn-outline-success">Login</button>
                      </Link>
                    </div>
                    <div className='mx-2'>
                      <Link to='/signup'>
                        <button type="button" className="btn btn-outline-secondary">Signup</button>
                      </Link>
                    </div>
                </div>
                )}
            </div>
        </div>
        </nav>
    </div>
  )
}

export default Navbar
