import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import Scrollbar from "react-perfect-scrollbar";
import { Accordion } from "react-bootstrap";

class Sidenav extends Component {
  navToggle = () => {
    document.getElementById("body").classList.toggle("ms-aside-left-open");
    document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
    document.getElementById("overlayleft").classList.toggle("d-block");
  };

  render() {
    // FIXED USER DATA
    const user = JSON.parse(localStorage.getItem("user"));
    const roleId = user?.userTypeId;

    const isWaiter =
      String(roleId) === String(process.env.REACT_APP_ROLE_WAITER);

    return (
      <Fragment>
        {/* Overlay */}
        <div
          className="ms-aside-overlay ms-overlay-left ms-toggler"
          id="overlayleft"
          onClick={this.navToggle}
        />

        {/* Sidebar */}
        <Scrollbar
          id="ms-side-nav"
          className="side-nav fixed ms-aside-scrollable ms-aside-left"
          style={{ backgroundColor: "#29748c" }}
        >
          {/* Logo */}
          <div
            className="logo-sn ms-d-block-lg"
            style={{ backgroundColor: "#29748c" }}
          >
            <Link className="pl-0 ml-0 text-center" to="/">
              <h3 style={{ color: "#fff" }}>ORDER FOOD</h3>
            </Link>
          </div>

          {/* Navigation */}
          <Accordion
            defaultActiveKey="0"
            className="accordion ms-main-aside fs-14"
          >
            {isWaiter ? (
              <>
                {/* WAITER MENU */}
                <li className="menu-item">
                  <Link to="/Dashboard">
                    <span>
                      <i className="fa-solid fa-house me-2"></i>
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/MenuCategory">
                    <span>
                      <i className="fa-solid fa-boxes me-2"></i>
                      Menu Category
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/MenuItems">
                    <span>
                      <i className="fa-solid fa-list me-2"></i>
                      Menu Items
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* ADMIN MENU */}
                <li className="menu-item">
                  <Link to="/Dashboard">
                    <span>
                      <i className="fa-solid fa-house me-2"></i>
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/user">
                    <span>
                      <i className="fa-solid fa-user-tie me-2"></i>
                      User
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/MenuCategory">
                    <span>
                      <i className="fa-solid fa-boxes me-2"></i>
                      Menu Category
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/MenuItems">
                    <span>
                      <i className="fa-solid fa-list me-2"></i>
                      Menu Items
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/Tables">
                    <span>
                      <i className="fa-solid fa-th me-2"></i>
                      Tables
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/OrderHistory">
                    <span>
                      <i className="fa-solid fa-history me-2"></i>
                      Order History
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/AverageOrder">
                    <span>
                      <i className="fa-solid fa-chart-line me-2"></i>
                      Average Order
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/CategoriesReport">
                    <span>
                      <i className="fa-solid fa-cubes-stacked me-2"></i>
                      Category Sales Report
                    </span>
                  </Link>
                </li>

                <li className="menu-item">
                  <Link to="/PopularOrder">
                    <span>
                      <i className="fa-solid fa-burger me-2"></i>
                      Popular Order
                    </span>
                  </Link>
                </li>

                {/* <li className="menu-item">
                  <Link to="/CustomerFeedbackReport">
                    <span>
                      <i className="fa-solid fa-comment-dots me-2"></i>
                      Customer Feedback Report
                    </span>
                  </Link>
                </li> */}
              </>
            )}
          </Accordion>
        </Scrollbar>
      </Fragment>
    );
  }
}

export default Sidenav;