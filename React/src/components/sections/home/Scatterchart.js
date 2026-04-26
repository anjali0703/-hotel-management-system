import React, { Component } from 'react';
import { Scatter } from 'react-chartjs-2';

const rand = () => Math.round(Math.random() * 20 - 10)
// scatter-chart
function scatterchart() {
    return {
        datasets: [
            {
                label: 'Data Rate',
                data: [
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                    { x: rand(), y: rand() },
                ],
                backgroundColor: '#357ffa',
            },
        ],
    }

}
// Options
const options = {
    legend: {
        labels: {
            fontColor: "#A8A9AD"
        }
    },
    scales: {
        xAxes: [{
            ticks: {
                fontColor: "#A8A9AD"
            }
        }],
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontColor: "#A8A9AD"
                },
            },
        ],
    },
}
class Scatterchart extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: scatterchart(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-xl-7 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <div className="d-flex justify-content-between">
                            <div className="ms-header-text">
                                <h6>Crypto Candle Chart</h6>
                                <p>Real time Crypto information and rating data</p>
                            </div>
                        </div>
                    </div>
                    <div className="ms-panel-body pt-0">
                        <div className="d-flex justify-content-between ms-graph-meta">
                            <ul className="ms-list-flex mt-3 mb-5">
                                <li>
                                    <span>Open Rate</span>
                                    <h3 className="ms-count">9,703.49</h3>
                                </li>
                                <li>
                                    <span>High Rate</span>
                                    <h3 className="ms-count">95,038</h3>
                                </li>
                                <li>
                                    <span>Low Rate</span>
                                    <h3 className="ms-count">28,387</h3>
                                </li>
                                <li>
                                    <span>Closed Rate</span>
                                    <h3 className="ms-count">12,785</h3>
                                </li>
                            </ul>
                        </div>
                        <Scatter data={this.state.data} options={options} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Scatterchart;