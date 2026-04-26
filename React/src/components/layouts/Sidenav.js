import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Scrollbar from "react-perfect-scrollbar";
import { Accordion } from "react-bootstrap";

import logo from "../../assets/img/hmm.jpg";

class Sidenav extends Component {
  navToggle = () => {
    document.getElementById("body").classList.toggle("ms-aside-left-open");
    document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
    document.getElementById("overlayleft").classList.toggle("d-block");
  };
  render() {
    return (
      <Fragment>
        {/* Overlays */}
        <div
          className="ms-aside-overlay ms-overlay-left ms-toggler"
          id="overlayleft"
          data-target="#ms-side-nav"
          data-toggle="slideLeft"
          onClick={this.navToggle}
        />
        {/* Sidebar Navigation Left */}
        <Scrollbar
          id="ms-side-nav"
          className="side-nav fixed ms-aside-scrollable ms-aside-left"
          style={{ backgroundColor: '#29748c' }}
        >
          {/* Logo */}
          <div className="logo-sn ms-d-block-lg" style={{ backgroundColor: '#29748c' }}>
            <Link className="pl-0 ml-0 text-center" to="/">
              {/* <img src={logo} alt="logo" style={{ width: '45px' }} /> */}
              <h3 style={{ color: "#fff" }}>HMM</h3>
            </Link>
          </div>
          {/* Navigation */}
          <Accordion
            defaultActiveKey="0"
            className="accordion ms-main-aside fs-14"
            id="side-nav-accordion"
          >

            {/* Dashboard */}
            <li className="menu-item">
              <Link to="/Dashboard">
                <span>
                  <i class="fa-solid fa-house fs-16" style={{ width: "10%" }}></i>Dashboard
                </span>
              </Link>
            </li>

            {/* user */}
            <li className="menu-item">
              <Link to="/user">
                <span>
                  <i class="fa-solid fa-user-tie fs-16" style={{ width: "10%" }}></i>User
                </span>
              </Link>
            </li>

            {/* Order History */}
            <li className="menu-item">
              <Link to="/MenuCategory">
                <span>
                  <i class="fa-solid fa-boxes fs-16" style={{ width: "10%" }}></i>Menu Category
                </span>
              </Link>
            </li>

            {/* Admin Order */}
            <li className="menu-item">
              <Link to="/MenuItems">
                <span>
                  <i class="fa-solid fa-list fs-16" style={{ width: "10%" }}></i>Menu Items
                </span>
              </Link>
            </li>

            {/*  Tables  */}
            <li className="menu-item">
              <Link to="/Tables">
                <span>
                  <i class="fa-solid fa-th fs-16" style={{ width: "10%" }}></i>Tables
                </span>
              </Link>
            </li>
                 <li className="menu-item">
              <Link to="/Order">
                <span>
                  <i class="fa-solid fa-th fs-16" style={{ width: "10%" }}></i>Order
                </span>
              </Link>
            </li>

            {/* Order History */}
            <li className="menu-item">
              <Link to="/OrderHistory">
                <span>
                  <i class="fa-solid fa-history fs-16" style={{ width: "10%" }}></i>Order History
                </span>
              </Link>
            </li>

          </Accordion>

          {/* Order Report */}
          <li className="menu-item">
            <Link to="/OrderReport">
              <span>
                <i class="fa-solid fa-file fs-16" style={{ width: "10%" }}></i>Order Report
              </span>
            </Link>
          </li>

          {/* Order Average */}
          <li className="menu-item">
            <Link to="/AverageOrder">
              <span>
                <i class="fa-solid fa-magnifying-glass-chart" style={{ width: "10%" }}></i>Average Order
              </span>
            </Link>
          </li>

          {/* Categories Report */}
          <li className="menu-item">
            <Link to="/CategoriesReport">
              <span>
                <i class="fa-solid fa-cubes-stacked" style={{ width: "10%" }}></i>Category Sales Report
              </span>
            </Link>
          </li>

          {/* Popular Item */}
          <li className="menu-item">
            <Link to="/PopularOrder">
              <span>
                <i class="fa-solid fa-burger" style={{ width: "10%" }}></i>Popular Order
              </span>
            </Link>
          </li>


          {/* Customer feedback Report */}
          <li className="menu-item">
            <Link to="/CustomerFeedbackReport">
              <span>
                <i class="fa-solid fa-comment-dots" style={{ width: "10%" }}></i>Customer feedback Report
              </span>
            </Link>
          </li>

        </Scrollbar>
      </Fragment>
    );
  }
}

export default Sidenav;
