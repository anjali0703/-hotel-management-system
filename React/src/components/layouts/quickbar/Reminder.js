import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import Scrollbar from 'react-perfect-scrollbar';

class Reminder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            count: 0,
            reminder: '',
            date: '',
            time: '',
            reminders: [
                {
                    title: 'Developer Meeting in Block B',
                    date: 'Today',
                    time: '3:45 pm',
                },
                {
                    title: 'Start adding change log to version 2',
                    date: 'Tomorrow',
                    time: '12:00 pm',
                }
            ]
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this)
        this.handleChangedate = this.handleChangedate.bind(this)
        this.handleChangetime = this.handleChangetime.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
   
    handleChange(event) {
        this.setState({ reminder: event.target.value })
    }
    handleChangedate(event) {
        this.setState({ date: event.target.value })
    }
    handleChangetime(event) {
        this.setState({ time: event.target.value })
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.reminder !== '' && this.state.reminder !== undefined) {
            this.state.reminders.push(
                { 
                    title: this.state.reminder,
                    date: this.state.date,
                    time: this.state.time,
                })
            this.setState({ tasks: this.state.tasks })
            this.handleClose()
        }
    }
    removereminder(index) {
        if (window.confirm("Are you sure you want to delete this reminder?")) {
        this.state.reminders.splice(index, 1)
        this.setState({ reminders: this.state.reminders })
        }
    }
    handleShow() {
        this.setState({ show: true });
    }
    handleClose() {
        this.setState({ show: false, reminder: '', date:'', time:'' });
    }
    render() {
        const reminders = (this.state.reminders || []).map((item, index) => (
            <div key={index} className="ms-card ms-qa-card ms-deletable">
                <div className="ms-card-body">
                    <p> {item.title} </p>
                    <span className="text-disabled fs-12"><i className="material-icons fs-14">access_time</i> {item.date} - {item.time}</span>
                </div>
                <div className="ms-card-footer clearfix">
                    <div className="ms-note-editor float-right">
                        <Link to="#" className="text-disabled mr-2" onClick={(e) => this.handleShow}> <i className="flaticon-pencil"> </i> Edit </Link>
                        <Link to="#" className="text-disabled  ms-delete-trigger" name="removeTask" onClick={event => this.removereminder(index, event)}> <i className="flaticon-trash"> </i> Delete </Link>
                    </div>
                </div>
            </div>
        ))
        return (
            <div className="ms-quickbar-container ms-reminders">
                <ul className="ms-qa-options">
                    <li> <Link to="#" onClick={this.handleShow}> <i className="flaticon-bell" /> New Reminder </Link> </li>
                </ul>
                <Scrollbar className="ms-quickbar-container ms-scrollable">
                    {reminders}
                    {this.state.reminder &&
                        <div className="ms-card ms-qa-card ms-deletable">
                            <div className="ms-card-footer">{this.state.reminder}{this.state.date}{this.state.time}</div>
                        </div>
                    }
                </Scrollbar>
                <Modal show={this.state.show} className="on-load-modal" onHide={this.handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header className="bg-secondary">
                        <h5 className="modal-title has-icon text-white"> New Reminder</h5>
                        <button type="button" className="close" onClick={this.handleClose}><span aria-hidden="true">×</span></button>
                    </Modal.Header>
                    <form name="sendTask" onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <div className="ms-form-group">
                                <label>Remind me about</label>
                                <input type="text" className="form-control" name="reminder" value={this.state.reminder} onChange={this.handleChange} />
                            </div>
                            <div className="ms-form-group">
                                <span className="ms-option-name fs-14">Repeat Daily</span>
                                <label className="ms-switch float-right">
                                    <input type="checkbox" />
                                    <span className="ms-switch-slider round" />
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="ms-form-group">
                                        <input type="date" name="date" className="form-control datepicker" value={this.state.date} onChange={this.handleChangedate} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="ms-form-group">
                                        <select className="form-control" name="time" onChange={this.handleChangetime}  value={this.state.time}>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="1:00 pm">1:00 pm</option>
                                            <option value="2:00 pm">2:00 pm</option>
                                            <option value="3:00 pm">3:00 pm</option>
                                            <option value="4:00 pm">4:00 pm</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-light" onClick={this.handleClose}>Close</button>
                            <button type="submit" name="addreminder" className="btn btn-secondary shadow-none">Add Reminder</button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default Reminder;