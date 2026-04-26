import React, { Component, Fragment } from 'react';
import { Line as LineChart } from 'react-chartjs-2';

// Bitcoin
function Bitcoin() {
    return {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        datasets: [{
            label: "Data",
            borderColor: '#F7931A',
            pointBorderColor: '#F7931A',
            pointBackgroundColor: '#F7931A',
            pointHoverBackgroundColor: '#F7931A',
            pointHoverBorderColor: '#F7931A',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: '#f7931a33',
            borderWidth: 2,
            data: [4, 3, 2, 3, 1, 4, 3, 5, 4, 5, 4, 6, 7, 5, 4]
        }]
    }
}
// Ethereum
function Ethereum() {
    return {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: '#4e8ee8',
            pointBorderColor: '#4e8ee8',
            pointBackgroundColor: '#4e8ee8',
            pointHoverBackgroundColor: '#4e8ee8',
            pointHoverBorderColor: '#4e8ee8',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: "rgba(78, 142, 232,0.2)",
            borderWidth: 2,
            data: [4,5,3,7,5,7,8,9,7,6,7,7,6,5,3]
        }]
    }
}
// ZCash
function ZCash() {
    return {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: '#e5a93d',
            pointBorderColor: '#e5a93d',
            pointBackgroundColor: '#e5a93d',
            pointHoverBackgroundColor: '#e5a93d',
            pointHoverBorderColor: '#e5a93d',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: "rgba(229, 169, 61,0.2)",
            borderWidth: 2,
            data: [5,6,8,1,5,3,9,7,5,8,7,3,6,9,1]
        }]
    }
}
// Peercoin
function Peercoin() {
    return {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
        datasets: [{
            label: "Data",
            borderColor: '#3FA30C',
            pointBorderColor: '#3FA30C',
            pointBackgroundColor: '#3FA30C',
            pointHoverBackgroundColor: '#3FA30C',
            pointHoverBorderColor: '#3FA30C',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            fill: true,
            backgroundColor: "rgba(63, 163, 12,0.2)",
            borderWidth: 2,
            data: [1,4,7,3,5,7,6,5,8,3,5,5,4,3,7]
        }]
    }
}
// Options
const options = {
    elements: {
        line: {
            tension: 0
        }
    },
    legend: {
        display: false,
        position: "bottom"
    },
    scales: {
        yAxes: [{
            display: false,
        }],
        xAxes: [{
            display: false,
        }]
    }
}
class Infographics extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data1: Bitcoin(),
            data2: Ethereum(),
            data3: ZCash(),
            data4: Peercoin(),
            open: true,
        }
    };
    render() {
        return (
            <Fragment>
                <div className="col-xl-3 col-sm-6 col-md-6">
                    <div className="ms-card ms-widget has-graph-full-width ms-infographics-widget">
                        <div className="ms-card-body media">
                            <i className="cc BTC" />
                            <div className="media-body">
                                <span>1 BTC = $4,500</span>
                                <h2>Bitcoin</h2>
                            </div>
                        </div>
                        <LineChart data={this.state.data1} options={options} />
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-md-6">
                    <div className="ms-card ms-widget has-graph-full-width ms-infographics-widget">
                        <div className="ms-card-body media">
                            <i className="cc ETH" />
                            <div className="media-body">
                                <span>1 ETH = $500</span>
                                <h2>Ethereum</h2>
                            </div>
                        </div>
                        <LineChart data={this.state.data2} options={options} />
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-md-6">
                    <div className="ms-card ms-widget has-graph-full-width ms-infographics-widget">
                        <div className="ms-card-body media">
                            <i className="cc ZEC-alt" />
                            <div className="media-body">
                                <span>1 ZEC = $1,500</span>
                                <h2>ZCash</h2>
                            </div>
                        </div>
                        <LineChart data={this.state.data3} options={options} />
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6 col-md-6">
                    <div className="ms-card ms-widget has-graph-full-width ms-infographics-widget">
                        <div className="ms-card-body media">
                            <i className="cc PPC-alt" />
                            <div className="media-body">
                                <span>1 PPC = $1,100</span>
                                <h2>Peercoin</h2>
                            </div>
                        </div>
                        <LineChart data={this.state.data4} options={options} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Infographics;