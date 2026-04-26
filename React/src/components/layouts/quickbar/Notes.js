import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Dropdown, NavLink } from "react-bootstrap";
import Scrollbar from 'react-perfect-scrollbar';

const notes = [
    {
        title: "Don't forget to check with the designer",
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate urna in faucibus venenatis. Etiam at dapibus neque, vel varius metus. Pellentesque eget orci malesuada, venenatis magna et',
        members: [
            {
                img: 'assets/img/people/people-3.jpg'
            },
            {
                img: 'assets/img/people/people-5.jpg'
            },
        ],
        shareuser: [
            {
                img: 'assets/img/people/people-10.jpg',
                name: 'Jhon Doe',
            },
            {
                img: 'assets/img/people/people-9.jpg',
                name: 'Raymart Sandigo',
            },
            {
                img: 'assets/img/people/people-7.jpg',
                name: 'Heather Brown',
            },
        ],
    },
    {
        title: 'Perform the required unit tests',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vulputate urna in faucibus venenatis. Etiam at dapibus neque, vel varius metus. Pellentesque eget orci malesuada, venenatis magna et',
        members: [
            {
                img: 'assets/img/people/people-9.jpg'
            },
        ],
        shareuser: [
            {
                img: 'assets/img/people/people-10.jpg',
                name: 'Jhon Doe',
            },
            {
                img: 'assets/img/people/people-9.jpg',
                name: 'Raymart Sandigo',
            },
            {
                img: 'assets/img/people/people-7.jpg',
                name: 'Heather Brown',
            },
        ],
    }
];

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: notes,
            show: false,
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    triggerDelete(notesIndex) {
        if (window.confirm("Are you sure you want to delete this Note?")) {
            let notes = this.state.notes;
            notes.splice(notesIndex, 1);
            this.setState({ notes: notes });
        }
    }
    handleShow() {
        this.setState({ show: true });
    }
    handleClose() {
        this.setState({ show: false });
    }
    render() {
        return (
            <Fragment>
              <ul className="ms-qa-options">
                <li> <Link to="#" onClick={this.handleShow}> <i className="flaticon-sticky-note" /> New Note </Link> </li>
                <li> <Link to="#"> <i className="flaticon-excel" /> Export to Excel </Link> </li>
              </ul>
              <Scrollbar className="ms-quickbar-container ms-scrollable">
                {notes.length > 0 ? notes.map((item, index) => (
                  <div key={index} className="ms-card ms-qa-card ms-deletable">
                    <div className="ms-card-header">
                      <h6 className="ms-card-title">{item.title}</h6>
                    </div>
                    <div className="ms-card-body">
                      <p>{item.text}</p>
                      <ul className="ms-note-members clearfix mb-0">
                        {item.members.map((member, index) => (
                          <li key={index} className="ms-deletable">
                            <img src={process.env.PUBLIC_URL+'/'+member.img} alt="member" />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="ms-card-footer clearfix">
                      <Dropdown className="float-left">
                        <Dropdown.Toggle as={NavLink} className="text-disabled p-0 toggle-icon-none"><i className="flaticon-share-1" /> Share</Dropdown.Toggle>
                        <Dropdown.Menu>
                          <li className="dropdown-menu-header">
                            <h6 className="dropdown-header ms-inline m-0"><span className="text-disabled">Share With</span></h6>
                          </li>
                          <li className="dropdown-divider" />
                          <Scrollbar className="ms-scrollable ms-dropdown-list ms-members-list">
                            {item.shareuser.map((user, index) => (
                              <Link key={index} className="media p-2" to="#">
                                <div className="mr-2 align-self-center">
                                  <img src={process.env.PUBLIC_URL+'/'+user.img} className="ms-img-round" alt="people" />
                                </div>
                                                    <div className="media-body">
                                                        <span>{user.name}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </Scrollbar>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <div className="ms-note-editor float-right">
                                    <Link to="#" className="text-disabled mr-2" onClick={this.handleShow}> <i className="flaticon-pencil"> </i> Edit </Link>
                                    <Link to="#" className="text-disabled  ms-delete-trigger" onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        this.triggerDelete(index);
                                    }}> <i className="flaticon-trash"> </i> Delete </Link>
                                </div>
                            </div>
                        </div>
                    )) : <div className="ms-card ms-qa-card ms-deletable"><div className="ms-card-footer"> No Notes Available</div></div>}
                </Scrollbar>
                <Modal show={this.state.show} className="on-load-modal" onHide={this.handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header className="bg-secondary">
                        <h5 className="modal-title has-icon text-white"> New Note</h5>
                        <button type="button" className="close" onClick={this.handleClose}><span aria-hidden="true">×</span></button>
                    </Modal.Header>
                    <form>
                        <Modal.Body>
                            <div className="ms-form-group">
                                <label>Note Title</label>
                                <input type="text" className="form-control" name="note-title" />
                            </div>
                            <div className="ms-form-group">
                                <label>Note Description</label>
                                <textarea className="form-control" name="note-description" defaultValue={""} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-light" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-secondary shadow-none" onClick={this.handleClose}>Add Note</button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </Fragment>
        );
    }
}

export default Notes;
