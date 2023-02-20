import React from "react";
import Logo from "../images/logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="logo" />
      <span>
        Made with 🤍 by <b>Santiago Bedoya</b>
      </span>
    </footer>
  );
};

export default Footer;
