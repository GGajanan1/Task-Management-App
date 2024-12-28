import React from 'react';
import { Link ,Navigate,useNavigate} from 'react-router-dom';
import { Context } from '../main';
import { useContext } from 'react';
import './Navbar.css'
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, user, setUser } = useContext(Context);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8080/api/v1/user/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout');
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><Link to="/" className='navbar-link'>About Us</Link></li>
        {!isAuthenticated ? (
          <>
            <li><Link to="/login" className="navbar-link">Login</Link></li>
            <li><Link to="/signup" className="navbar-link">Signup</Link></li>
          </>
        ) : (
            <>
                <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
                <li><Link to="/summary" className="navbar-link">Summary</Link></li>
                <li><Link to="/addNew" className="navbar-link">AddNew</Link></li>
                <li><Link onClick={handleLogout} className="navbar-link">Logout</Link></li>
            </>
         
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
