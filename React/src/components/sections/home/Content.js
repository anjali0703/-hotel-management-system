import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-data-table-component-extensions/dist/index.css";
import "../../../App.css";
import "../../../assets/css/toastr.min.css";
import axios from "axios";
const Content = () => {
  const apiUrl = process.env.REACT_APP_API_URL;


  return (
    <div
      className="app"
      style={{
        borderRadius: "20px",
        padding: "20px",
        margin: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <header className="header">
        <h3 style={{ textAlign: 'left' }}>
          <b>Dashboard</b>
        </h3>
      </header>
    </div >
  );
};

export default Content;



