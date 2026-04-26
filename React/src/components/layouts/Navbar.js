import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Nav } from "react-bootstrap";
// import Scrollbar from "react-perfect-scrollbar";

import logosmdark from "../../assets/img/logo-sm-dark.png";
import people5 from "../../assets/img/people/people-5.jpg";
// import people9 from "../../assets/img/people/people-9.jpg";
// import people3 from "../../assets/img/people/people-3.jpg";
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page
  };

  const navToggle = () => {
    document.getElementById("body").classList.toggle("ms-aside-left-open");
    document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
    document.getElementById("overlayleft").classList.toggle("d-block");
  };

  const activityToggle = () => {
    document
      .getElementById("ms-recent-activity")
      .classList.toggle("ms-aside-open");
    document.getElementById("overlayright").classList.toggle("d-block");
  };

  const optionsToggle = () => {
    document.getElementById("ms-nav-options").classList.toggle("ms-slide-down");
  };

  return (
    <nav className="navbar ms-navbar">
      <div
        className="ms-aside-toggler ms-toggler pl-0"
        data-target="#ms-side-nav"
        data-toggle="slideLeft"
        onClick={navToggle}
      >
      </div>
      <div className="logo-sn logo-sm ms-d-block-sm">
        <Link className="pl-0 ml-0 text-center navbar-brand mr-0" to="/">
          <img src={logosmdark} alt="logo" />{" "}
        </Link>
      </div>
      <ul className="ms-nav-list ms-inline mb-0" id="ms-nav-options">
        <li className="ms-nav-item ms-search-form pb-0 py-0">
          <form className="ms-form" method="post">
            <div className="ms-form-group my-0 mb-0 has-icon fs-14">
              <input
                type="search"
                className="ms-form-input"
                name="search"
                placeholder="Search here..."
              />
              <i className="flaticon-search text-disabled" />
            </div>
          </form>
        </li>
        {/* <Dropdown className="ms-nav-item">
          <Dropdown.Toggle
            as={Nav.Link}
            className="text-disabled ms-has-notification p-0"
            id="mailDropdown"
          >
            <i className="flaticon-mail" />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu-right"
            aria-labelledby="mailDropdown"
          >
            <Dropdown.Header>
              <h6 className="dropdown-header ms-inline m-0">
                <span className="text-disabled">Mail</span>
              </h6>
              <span className="badge badge-pill badge-success">3 New</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Scrollbar className="ms-scrollable ms-dropdown-list">
              <Link className="media p-2" to="#">
                <div className="ms-chat-status ms-status-offline ms-chat-img mr-2 align-self-center">
                  <img src={people5} className="ms-img-round" alt="people" />
                </div>
                <div className="media-body">
                  <span>Hey man, looking forward to your new project.</span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 30 seconds ago
                  </p>
                </div>
              </Link>
              <Link className="media p-2" to="#">
                <div className="ms-chat-status ms-status-online ms-chat-img mr-2 align-self-center">
                  <img src={people9} className="ms-img-round" alt="people" />
                </div>
                <div className="media-body">
                  <span>
                    Dear John, I was told you bought Mystic! Send me your
                    feedback
                  </span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 28 minutes ago
                  </p>
                </div>
              </Link>
              <Link className="media p-2" to="#">
                <div className="ms-chat-status ms-status-offline ms-chat-img mr-2 align-self-center">
                  <img src={people3} className="ms-img-round" alt="people" />
                </div>
                <div className="media-body">
                  <span>How many people are we inviting to the dashboard?</span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 6 hours ago
                  </p>
                </div>
              </Link>
            </Scrollbar>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} className="text-center" to="/apps/email">
              Go to Inbox
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="ms-nav-item">
          <Dropdown.Toggle
            as={Nav.Link}
            className="text-disabled ms-has-notification p-0"
            id="notificationDropdown"
          >
            <i className="flaticon-bell" />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu-right"
            aria-labelledby="notificationDropdown"
          >
            <Dropdown.Header>
              <h6 className="dropdown-header ms-inline m-0">
                <span className="text-disabled">Notifications</span>
              </h6>
              <span className="badge badge-pill badge-info">4 New</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Scrollbar className="ms-scrollable ms-dropdown-list">
              <Dropdown.Item as={Link} to="#">
                <div className="media-body">
                  <span>12 ways to improve your crypto dashboard</span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 30 seconds ago
                  </p>
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="#">
                <div className="media-body">
                  <span>You have newly registered users</span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 45 minutes ago
                  </p>
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="#">
                <div className="media-body">
                  <span>
                    Your account was logged in from an unauthorized IP
                  </span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 2 hours ago
                  </p>
                </div>
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="#">
                <div className="media-body">
                  <span>An application form has been submitted</span>
                  <p className="fs-10 my-1 text-disabled">
                    <i className="material-icons">access_time</i> 1 day ago
                  </p>
                </div>
              </Dropdown.Item>
            </Scrollbar>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} className="text-center" to="#">
              View all Notifications
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        {/* <li className="ms-nav-item">
          <Link
            to="#"
            className="text-disabled ms-toggler"
            data-target="#ms-recent-activity"
            data-toggle="slideRight"
            onClick={activityToggle}
          >
            <i className="flaticon-menu" />
          </Link>
        </li> */}
        <Dropdown className="ms-nav-item ms-nav-user">
          <Dropdown.Toggle
            as={Nav.Link}
            id="userDropdown"
            className="p-0 toggle-icon-none"
          >
            <img
              className="ms-user-img ms-img-round float-right"
              src={people5}
              alt="people"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu-right user-dropdown"
            aria-labelledby="userDropdown"
          >
            <Dropdown.Header>
              <h6 className="dropdown-header ms-inline m-0">
                <span className="text-disabled">Welcome, Anny Farisha</span>
              </h6>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item
              as={Link}
              className="fs-14 p-2"
              to="/prebuilt-pages/user-profile"
            >
              <span>
                <i className="flaticon-user mr-2" /> Profile
              </span>
            </Dropdown.Item>
            <Dropdown.Item as={Link} className="fs-14 p-2" to="/apps/email">
              <span>
                <i className="flaticon-mail mr-2" /> Inbox
              </span>{" "}
              <span className="badge badge-pill badge-info">3</span>
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              className="fs-14 p-2"
              to="/prebuilt-pages/user-settings"
            >
              <span>
                <i className="flaticon-gear mr-2" /> Settings
              </span>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              as={Link}
              className="fs-14 px-2 d-flex align-items-center"
              to="/loginpage"
              onClick={handleLogout}
            >
              <span>
                <i className="flaticon-shut-down mr-2" /> Logout{" "}
              </span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ul>
    </nav>
  );
};

export default Navbar;
