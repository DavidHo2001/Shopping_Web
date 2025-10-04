import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/Glasy.png";
import { useUser } from "../contexts/UserContext";


const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  // Get user data from context
  const { user, dataLoading, logout, isLoggedIn, getCartItemCount } = useUser();
  //useEffect to check if user is logged in when page loads
  useEffect(() => {
    if (!dataLoading) {
      setUsername(user.username);
      //console.log(user);
    }
  }, [user]);


  const clickUsername = () => {
    navigate("/profile");
  };
  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include"
    })
      .then(res => {
        if (res.ok) {
          alert("Logout successful!");
          logout(); //setUser(null)
          window.location.reload();
        } else {
          alert("Logout failed!");
        }
      });
  };


  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Glasy
        <img src={logo} alt="Glasy" />
      </Link>
      <ul className="navbar__categories">
        <li onClick={() => navigate("/product/")}>All</li>
        <li onClick={() => navigate("/product/Men")}>Men</li>
        <li onClick={() => navigate("/product/Women")}>Women</li>
        <li onClick={() => navigate("/product/Accessories")}>Accessories</li>
      </ul>
      <div className="navbar__actions">
        <input className="navbar__search" placeholder="Search Products" />
        {user?.role >= 2 && (
        <button
          className="navbar__button"
          onClick={() => navigate("/admin-product")}
        >
          Upload Product
        </button>
      )}
        <button className="navbar__button" onClick={username ? clickUsername : handleLogin}>
          {username ? (
            <span>
              {username} ✏️
            </span>
          ) : "Login"}
        </button>
        <button className="navbar__button" onClick={ username ? handleLogout : handleRegister}>
          {username ? "Logout" : "Register"}
        </button>
        <button className="navbar__button cart-button" onClick={() => navigate("/cart")}>
          🛒 {getCartItemCount() > 0 && <span className="cart-count">{getCartItemCount()}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
