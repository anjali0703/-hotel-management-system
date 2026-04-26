import React, { Component } from "react";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip, Tab, Nav } from "react-bootstrap";
import Chat from "./quickbar/Chat";
import Email from "./quickbar/Email";
import Invite from "./quickbar/Invite";
import Notes from "./quickbar/Notes";
import Reminder from "./quickbar/Reminder";
import Todo from "./quickbar/Todo";

const chattip = <Tooltip>Launch Chat</Tooltip>;
const emailtip = <Tooltip>Launch Email</Tooltip>;
const todotip = <Tooltip>Launch To-do-list</Tooltip>;
const reminderstip = <Tooltip>Launch Reminders</Tooltip>;
const notestip = <Tooltip>Launch Notes</Tooltip>;
const memberstip = <Tooltip>Invite Members</Tooltip>;
const hammertip = <Tooltip>Configure Quick Access</Tooltip>;

class Quickbar extends Component {
  openBar = () => {
    document.getElementById("ms-quick-bar").classList.add("ms-quick-bar-open");
  };
  closeBar = () => {
    document
      .getElementById("ms-quick-bar")
      .classList.remove("ms-quick-bar-open");
  };
  toggleConfigure = () => {
    document
      .getElementById("ms-quick-bar-list")
      .classList.toggle("ms-qa-configure-mode");
    document
      .getElementById("ms-quick-bar")
      .classList.remove("ms-quick-bar-open");
    document.getElementById("ms-quick-bar-content").classList.toggle("d-none");
    document
      .querySelectorAll("a.nav-link")
      .forEach((b) => b.toggleAttribute("data-rb-event-key"));
  };
  render() {
    return (
      <aside id="ms-quick-bar" className="ms-quick-bar fixed ms-d-block-lg">
        <Tab.Container>
          <Nav
            variant="tab"
            className="nav nav-tabs ms-quick-bar-list"
            id="ms-quick-bar-list"
          >
            {/* <OverlayTrigger placement="left" overlay={chattip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="chat" onClick={this.openBar}>
                  <i className="flaticon-chat" />
                  <span className="ms-quick-bar-label">Chat</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={emailtip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="mail" onClick={this.openBar}>
                  <i className="flaticon-mail" />
                  <span className="ms-quick-bar-label">Email</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={todotip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="todo" onClick={this.openBar}>
                  <i className="flaticon-list" />
                  <span className="ms-quick-bar-label">To-do</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={reminderstip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="reminder" onClick={this.openBar}>
                  <i className="flaticon-bell" />
                  <span className="ms-quick-bar-label">Reminder</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={notestip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="notes" onClick={this.openBar}>
                  <i className="flaticon-pencil" />
                  <span className="ms-quick-bar-label">Notes</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger>
            <OverlayTrigger placement="left" overlay={memberstip}>
              <Nav.Item className="ms-quick-bar-item ms-has-qa">
                <Nav.Link eventKey="invite" onClick={this.openBar}>
                  <i className="flaticon-share-1" />
                  <span className="ms-quick-bar-label">Invite</span>
                </Nav.Link>
              </Nav.Item>
            </OverlayTrigger> */}
          </Nav>
          {/* <OverlayTrigger placement="left" overlay={hammertip}>
            <div className="ms-configure-qa" onClick={this.toggleConfigure}>
              <Link to="#">
                <i className="flaticon-hammer" />
                <span className="ms-quick-bar-label">Configure</span>
              </Link>
            </div>
          </OverlayTrigger> */}
          {/* Quick bar Content */}
          <div className="ms-quick-bar-content" id="ms-quick-bar-content">
            <div className="ms-quick-bar-header clearfix">
              <h5 className="ms-quick-bar-title float-left">Title</h5>
              <button
                type="button"
                className="close ms-toggler"
                onClick={this.closeBar}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <Tab.Content className="ms-quick-bar-body">
              <Tab.Pane eventKey="chat">
                <Chat />
              </Tab.Pane>
              <Tab.Pane eventKey="mail">
                <Email />
              </Tab.Pane>
              <Tab.Pane eventKey="todo">
                <Todo />
              </Tab.Pane>
              <Tab.Pane eventKey="reminder">
                <Reminder />
              </Tab.Pane>
              <Tab.Pane eventKey="notes">
                <Notes />
              </Tab.Pane>
              <Tab.Pane eventKey="invite">
                <Invite />
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </aside>
    );
  }
}
export default Quickbar;

