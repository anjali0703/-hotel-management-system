import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';
import { Tab, Nav } from 'react-bootstrap'; 

class Recentactivity extends Component {
    activityToggle = () => {
        document.getElementById('ms-recent-activity').classList.toggle('ms-aside-open');
        document.getElementById('overlayright').classList.toggle('d-block');
    }
    render() {
        return (
            <Fragment>
                <div className="ms-aside-overlay ms-overlay-right ms-toggler" id="overlayright" data-target="#ms-recent-activity" data-toggle="slideRight" onClick={this.activityToggle} />
                <Scrollbar id="ms-recent-activity" className="side-nav fixed ms-aside-right ms-scrollable">
                    <Tab.Container defaultActiveKey="activityLog">
                        <div className="ms-aside-header">
                            <Nav variant="pills" className="nav nav-tabs tabs-bordered d-flex nav-justified mb-3">
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="activityLog" className="fw-600">Activity Log</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="recentPosts" className="fw-600">Settings</Nav.Link>
                                </Nav.Item>
                                <li><button type="button" className="close ms-toggler text-center" data-target="#ms-recent-activity" data-toggle="slideRight"><span aria-hidden="true" onClick={this.activityToggle}>×</span></button></li>
                            </Nav>
                        </div>
                        <div className="ms-aside-body">
                            <Tab.Content>
                                <Tab.Pane eventKey='activityLog'>
                                <ul className="ms-activity-log">
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-light">
                                                <i className="flaticon-gear" />
                                            </div>
                                            <h6>Update 1.0.0 Pushed</h6>
                                            <span> <i className="material-icons">event</i>1 January, 2022</span>
                                            <p className="fs-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, ula in sodales vehicula....</p>
                                        </li>
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-success">
                                                <i className="flaticon-tick-inside-circle" />
                                            </div>
                                            <h6>Profile Updated</h6>
                                            <span> <i className="material-icons">event</i>4 March, 2018</span>
                                            <p className="fs-14">Curabitur purus sem, malesuada eu luctus eget, suscipit sed turpis. Nam pellentesque felis vitae justo accumsan, sed semper nisi sollicitudin...</p>
                                        </li>
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-warning">
                                                <i className="flaticon-alert-1" />
                                            </div>
                                            <h6>Your payment is due</h6>
                                            <span> <i className="material-icons">event</i>1 January, 2022</span>
                                            <p className="fs-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, ula in sodales vehicula....</p>
                                        </li>
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-danger">
                                                <i className="flaticon-alert" />
                                            </div>
                                            <h6>Database Error</h6>
                                            <span> <i className="material-icons">event</i>4 March, 2018</span>
                                            <p className="fs-14">Curabitur purus sem, malesuada eu luctus eget, suscipit sed turpis. Nam pellentesque felis vitae justo accumsan, sed semper nisi sollicitudin...</p>
                                        </li>
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-info">
                                                <i className="flaticon-information" />
                                            </div>
                                            <h6>Checkout what's Trending</h6>
                                            <span> <i className="material-icons">event</i>1 January, 2022</span>
                                            <p className="fs-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque scelerisque diam non nisi semper, ula in sodales vehicula....</p>
                                        </li>
                                        <li>
                                            <div className="ms-btn-icon btn-pill icon btn-secondary">
                                                <i className="flaticon-diamond" />
                                            </div>
                                            <h6>Your Dashboard is ready</h6>
                                            <span> <i className="material-icons">event</i>4 March, 2018</span>
                                            <p className="fs-14">Curabitur purus sem, malesuada eu luctus eget, suscipit sed turpis. Nam pellentesque felis vitae justo accumsan, sed semper nisi sollicitudin...</p>
                                        </li>
                                    </ul>
                                    <Link to="#" className="btn btn-primary d-block"> View All </Link>
                                </Tab.Pane>
                                <Tab.Pane eventKey='recentPosts'>
                                <h6>General Settings</h6>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Location Tracking</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Allow Notifications</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Allow Popups</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" defaultChecked />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <h6>Log Settings</h6>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Enable Logging</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" defaultChecked />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Audit Logs</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Error Logs</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" defaultChecked />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <h6>Advanced Settings</h6>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Enable Logging</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" defaultChecked />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Audit Logs</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                    <div className="ms-form-group">
                                        <span className="ms-option-name fs-14">Error Logs</span>
                                        <label className="ms-switch float-right">
                                            <input type="checkbox" defaultChecked />
                                            <span className="ms-switch-slider round" />
                                        </label>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </Scrollbar>
            </Fragment>
        );
    }
}

export default Recentactivity;