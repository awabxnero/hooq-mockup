import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import logo from "../images/hooq.jpg";
const Header = () => {
  return (
    <AppBar position="static" color="primary" className="header">
      <img className="logo" src={logo} alt="" />
    </AppBar>
  );
};

export default Header;
