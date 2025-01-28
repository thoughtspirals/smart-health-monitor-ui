import React from "react";
import "../../styles/reusable-component-styles/header.css";
import { Link } from "react-router-dom";
import logo from "../../images/home/Logo.png"; // Ensure the path to the logo is correct.

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Logo" className="header-logo" />
      </Link>
    </header>
  );
};

export default Header;
