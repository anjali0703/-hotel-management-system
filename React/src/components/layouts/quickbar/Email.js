import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from 'react-perfect-scrollbar';

const emails = [
    {
        img: 'assets/img/people/people-11.jpg',
        name: 'James Zathila',
        mailtitle: '[WordPress] New Comment',
        mailtime: '2 Hours ago',
        mailcomment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in arcu turpis. Nunc'
    },
    {
        img: 'assets/img/people/people-10.jpg',
        name: 'John Doe',
        mailtitle: '[WordPress] New Comment',
        mailtime: '8 Hours ago',
        mailcomment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in arcu turpis. Nunc'
    },
    {
        img: 'assets/img/people/people-7.jpg',
        name: 'Heather Brown',
        mailtitle: '[WordPress] New Comment',
        mailtime: '1 Day ago',
        mailcomment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in arcu turpis. Nunc'
    },
]
class Email extends Component {
    render() {
        return (
            <div className="ms-email-container">
              <div className="ms-qa-options">
                <Link to="#" className="btn btn-primary w-100 mt-0 has-icon"> <i className="flaticon-pencil" /> Compose Email </Link>
              </div>
              <Scrollbar className="ms-scrollable ms-quickbar-container">
                {emails.map((item, i) => (
                  <li key={i} className="p-3  media ms-email clearfix">
                    <div className="ms-email-img mr-3 ">
                      <img src={process.env.PUBLIC_URL+'/'+item.img} className="ms-img-round" alt="people" />
                    </div>
                    <div className="media-body ms-email-details">
                                <span className="ms-email-sender">{item.name}</span>
                                <h6 className="ms-email-subject">{item.mailtitle}</h6> <span className="ms-email-time">{item.mailtime}</span>
                                <p className="ms-email-msg">{item.mailcomment}</p>
                            </div>
                        </li>
                    ))}
                </Scrollbar>
            </div>
        );
    }
}

export default Email;
