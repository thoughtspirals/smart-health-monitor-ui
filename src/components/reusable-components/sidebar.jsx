import React, { useState } from "react";
import "../../styles/reusable-component-styles/sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false); // Initialize state outside of toggleMenu

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState); // Toggle the menu state
  };

  const toggleLogin = () => {
    setLoginOpen((prevState) => !prevState); // Toggle the menu state
  };

  return (
    <div className="menu-container">
      <button className="menu-toggle mx-2" onClick={toggleLogin}>
        {loginOpen ? "X" : "Login"}
      </button>
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? "X" : "Menu"}
      </button>
      {menuOpen && (
        <ul className="menu-options">
          <li>About Us</li>
          <li>Locations</li>
          <li>Blog</li>
          <li>Reviews</li>
          <li>Contact</li>
          <li>Socials</li>
        </ul>
      )}

      {loginOpen && (
        <ul className="menu-options">
          <li>
            <Link to="/Login" className="nav-link">
              Login
            </Link>
          </li>
          <li>
            <Link to="/sign-up" className="nav-link">
              Sign Up
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
