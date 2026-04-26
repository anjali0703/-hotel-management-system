import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';

class Orders extends Component {
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-panel-fh ms-crypto-orders">
                    <Tab.Container defaultActiveKey="buyorder">
                        <div className="ms-panel-header">
                            <div className="d-flex justify-content-between">
                                <div className="ms-header-text">
                                    <h6>Current Orders</h6>
                                    <p>Manage your current sale and buy orders</p>
                                </div>
                                <Nav variant="tab" className="btn-group btn-group-toggle nav nav-tabs ms-graph-metrics">
                                    <Nav.Item>
                                        <Nav.Link eventKey="buyorder" className="btn btn-sm btn-outline-primary">Buy Orders</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="sorders" className="btn btn-sm btn-outline-primary">Sell Orders</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </div>
                        <div className="ms-panel-body p-0">
                            <Tab.Content>
                                <Tab.Pane eventKey="buyorder">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Price ($)</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Track ID</th>
                                                    <th scope="col">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>$7860.24</td>
                                                    <td><i className="cc BTC" /> 0.528</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$5813.44</td>
                                                    <td><i className="cc ETH" />0.345</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$1264.99</td>
                                                    <td><i className="cc BTC" />0.117</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$3789.31</td>
                                                    <td><i className="cc PPC-alt" />0.217</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="sorders">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Price ($)</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Track ID</th>
                                                    <th scope="col">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>$7860.24</td>
                                                    <td><i className="cc BTC" /> 0.528</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$3360.14</td>
                                                    <td><i className="cc ETH" />0.215</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$1264.99</td>
                                                    <td><i className="cc BTC" />0.117</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                                <tr>
                                                    <td>$3789.31</td>
                                                    <td><i className="cc PPC-alt" />0.217</td>
                                                    <td>#TR34351</td>
                                                    <td>12.01.2022</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>
        );
    }
}

export default Orders;