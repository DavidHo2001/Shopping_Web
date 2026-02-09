import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/Glasy.png';
import { useUser } from '../contexts/UserContext';
import { logout as logoutService } from '../service/ApiService/AuthService';

const Navbar= () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { user, dataLoading, logout, getCartItemCount } = useUser();

  useEffect(() => {
    if (!dataLoading && user) {
      setUsername(user.username);
    } else {
      setUsername(null);
    }
  }, [user, dataLoading]);

  const clickUsername = () => {
    navigate('/profile');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = async () => {
    const success = await logoutService();
    if (success) {
      alert('Logout successful!');
      logout();
      window.location.reload();
    } else {
      alert('Logout failed!');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Glasy
        <img src={logo} alt="Glasy" />
      </Link>
      <ul className="navbar__categories">
        <li onClick={() => navigate('/product/')}>All</li>
        <li onClick={() => navigate('/product/Men')}>Men</li>
        <li onClick={() => navigate('/product/Women')}>Women</li>
        <li onClick={() => navigate('/product/Accessories')}>Accessories</li>
      </ul>
      <div className="navbar__actions">
        <input className="navbar__search" placeholder="Search Products" />
        {user?.role && user.role >= 2 && (
          <button className="navbar__button" onClick={() => navigate('/admin-product')}>
            Upload Product
          </button>
        )}
        {user?.role && user.role === 3 && (
          <button className="navbar__button" onClick={() => navigate('/user-role-management')}>
            User Management
          </button>
        )}
        <button className="navbar__button" onClick={username ? clickUsername : handleLogin}>
          {username ? <span>{username} ✏️</span> : 'Login'}
        </button>
        <button className="navbar__button" onClick={username ? handleLogout : handleRegister}>
          {username ? 'Logout' : 'Register'}
        </button>
        <button className="navbar__button cart-button" onClick={() => navigate('/cart')}>
          🛒{' '}
          {getCartItemCount() > 0 && (
            <span className="cart-count">{getCartItemCount()}</span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
