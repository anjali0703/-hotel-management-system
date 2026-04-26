import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';

class Marketpos extends Component {
    render() {
        return (
            <div className="col-xl-5 col-md-12">
                <div className="ms-panel ms-widget ms-crypto-widget">
                    <div className="ms-panel-header">
                        <h6>Crypto Market Position</h6>
                        <p>Market Value and Position of Cryptocurrency</p>
                    </div>
                    <div className="ms-panel-body p-0">
                        <Tab.Container defaultActiveKey="btc">
                            <Nav variant="tab" className="nav nav-tabs nav-justified has-gap px-4 pt-4">
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="btc">BTC</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="xrp">XRP</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="ltc">LTC</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="eth">ETH</Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="fs-12">
                                    <Nav.Link eventKey="zec">ZEC</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="btc">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Position</th>
                                                    <th scope="col">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>United Kingdom</td>
                                                    <td>8528.70</td>
                                                    <td className="ms-text-success">+17.24%</td>
                                                    <td>7.65%</td>
                                                </tr>
                                                <tr>
                                                    <td>United States</td>
                                                    <td>4867.41</td>
                                                    <td className="ms-text-danger">-12.24%</td>
                                                    <td>9.12%</td>
                                                </tr>
                                                <tr>
                                                    <td>Australia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                                <tr>
                                                    <td>Netherlands</td>
                                                    <td>1614.19</td>
                                                    <td className="ms-text-danger">-20.75%</td>
                                                    <td>12.25%</td>
                                                </tr>
                                                <tr>
                                                    <td>Russia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="xrp">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Position</th>
                                                    <th scope="col">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>United Kingdom</td>
                                                    <td>7548.70</td>
                                                    <td className="ms-text-success">+12.24%</td>
                                                    <td>7.65%</td>
                                                </tr>
                                                <tr>
                                                    <td>United States</td>
                                                    <td>3167.41</td>
                                                    <td className="ms-text-danger">-4.24%</td>
                                                    <td>9.12%</td>
                                                </tr>
                                                <tr>
                                                    <td>Australia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+14.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                                <tr>
                                                    <td>Netherlands</td>
                                                    <td>1614.19</td>
                                                    <td className="ms-text-danger">-12.75%</td>
                                                    <td>12.25%</td>
                                                </tr>
                                                <tr>
                                                    <td>Russia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="ltc">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Position</th>
                                                    <th scope="col">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>United Kingdom</td>
                                                    <td>8528.70</td>
                                                    <td className="ms-text-success">+17.24%</td>
                                                    <td>7.65%</td>
                                                </tr>
                                                <tr>
                                                    <td>United States</td>
                                                    <td>4867.41</td>
                                                    <td className="ms-text-danger">-12.24%</td>
                                                    <td>9.12%</td>
                                                </tr>
                                                <tr>
                                                    <td>Australia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                                <tr>
                                                    <td>Netherlands</td>
                                                    <td>1614.19</td>
                                                    <td className="ms-text-danger">-20.75%</td>
                                                    <td>12.25%</td>
                                                </tr>
                                                <tr>
                                                    <td>Russia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="eth">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Position</th>
                                                    <th scope="col">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>United Kingdom</td>
                                                    <td>7548.70</td>
                                                    <td className="ms-text-success">+12.24%</td>
                                                    <td>7.65%</td>
                                                </tr>
                                                <tr>
                                                    <td>United States</td>
                                                    <td>3167.41</td>
                                                    <td className="ms-text-danger">-4.24%</td>
                                                    <td>9.12%</td>
                                                </tr>
                                                <tr>
                                                    <td>Australia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+14.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                                <tr>
                                                    <td>Netherlands</td>
                                                    <td>1614.19</td>
                                                    <td className="ms-text-danger">-12.75%</td>
                                                    <td>12.25%</td>
                                                </tr>
                                                <tr>
                                                    <td>Russia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="zec">
                                    <div className="table-responsive">
                                        <table className="table table-hover thead-light">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Country</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Position</th>
                                                    <th scope="col">Volume</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>United Kingdom</td>
                                                    <td>8528.70</td>
                                                    <td className="ms-text-success">+17.24%</td>
                                                    <td>7.65%</td>
                                                </tr>
                                                <tr>
                                                    <td>United States</td>
                                                    <td>4867.41</td>
                                                    <td className="ms-text-danger">-12.24%</td>
                                                    <td>9.12%</td>
                                                </tr>
                                                <tr>
                                                    <td>Australia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                                <tr>
                                                    <td>Netherlands</td>
                                                    <td>1614.19</td>
                                                    <td className="ms-text-danger">-20.75%</td>
                                                    <td>12.25%</td>
                                                </tr>
                                                <tr>
                                                    <td>Russia</td>
                                                    <td>7538.90</td>
                                                    <td className="ms-text-success">+32.04%</td>
                                                    <td>14.29%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
                <div className="ms-panel">
                    <div className="ms-panel-header">
                        <h6>Quick Stats</h6>
                    </div>
                    <div className="ms-panel-body p-0">
                        <div className="ms-quick-stats">
                            <div className="ms-stats-grid">
                                <i className="cc BTC" />
                                <p className="ms-text-dark">$8,033</p>
                                <span>Bitcoin</span>
                            </div>
                            <div className="ms-stats-grid">
                                <i className="cc ETH" />
                                <p className="ms-text-dark">$3,039</p>
                                <span>Ethereum</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Marketpos;