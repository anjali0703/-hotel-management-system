import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, NavLink } from 'react-bootstrap';
import { Line as LineChart } from 'react-chartjs-2';
 
// crypto-rating-graph
function cryptoratinggraph() {
    return {
        labels: ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"],
        datasets: [{
            label: "Price",
            borderColor: '#357ffa',
            pointBorderWidth: 9,
            pointRadius: 9,
            pointBorderColor: 'transparent',
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: '#357ffa',
            pointBackgroundColor: 'transparent',
            fill: true,
            backgroundColor: "rgba(53,127,250,0.4)",
            borderWidth: 2,
            data: [65, 59, 80, 81, 56, 55, 40, 70, 56, 76, 51, 59]
        }]
    }
}
// Options
const options = {
    animation: false,
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0,
    elements: {
        line: {
            tension: 0
        }
    },
    legend: {
        display: false,
        position: "top"
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                padding: 20,
                fontColor: "#A8A9AD"
            },
        }],
        xAxes: [{
            ticks: {
                padding: 20,
                beginAtZero: true,
                fontColor: "#A8A9AD"
            }
        }]
    }
}

class Bitcoingraph extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: cryptoratinggraph(),
            open: true,
        }
    };
    
    render() {
        return (
            <div className="col-xl-7 col-md-12">
                <div className="ms-panel ms-panel-fh ms-crypto-rating">
                    <div className="ms-panel-header header-mini">
                        <div className="d-flex justify-content-between">
                            <div className="ms-header-text">
                                <h6>Bitcoin Rating Graph</h6>
                                <p>Real time Crypto information and rating data</p>
                            </div>
                        </div>
                        <Dropdown className="dropdown">
                            <Dropdown.Toggle as={NavLink} className="has-chevron p-0">
                                <i className="cc BTC" /> Bitcoin
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <li className="ms-dropdown-list">
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>Ethereum</span>
                                        </div>
                                    </Link>
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>ZCash</span>
                                        </div>
                                    </Link>
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>Peer Coin</span>
                                        </div>
                                    </Link>
                                </li>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="ms-panel-body">
                        <LineChart data={this.state.data} options={options} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Bitcoingraph;