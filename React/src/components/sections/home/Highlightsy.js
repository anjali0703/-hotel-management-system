import React, { Component } from 'react';

const highlight = [
    {
        badge: 'Bitcoin',
        text: "Bitcoin Cash’s Birthday, Binance Acquires Trust Wallet, Wikipedia Rejects ICO, Krugman Predicts Crypto Collapse, More Regulation in Japan",
        time: '10 Minutes Ago',
        warning: true,
        primary: false,
        light: false,
    },
    {
        badge: 'Ethereum',
        text: "Coinbase Adds XRP Support, Goldman Sachs Crypto Custody, Starbucks Denies BTC Rumors, Bank of Thailand Approves Crypto, Bitmain Confirms Texas Facility",
        time: '1 Day Ago',
        warning: false,
        primary: true,
        light: false,
    }
];

class Highlightsy extends Component {
    render() {
        return (
            <div className="col-xl-5 col-md-12">
                {highlight.map((item, i) => (
                    <div key={i} className="ms-panel ms-news-highlight">
                        <div className="ms-panel-body">
                            {
                                item.warning === true ? <span className="badge badge-warning">{item.badge}</span> : ''
                            }
                            {
                                item.primary === true ? <span className="badge badge-primary">{item.badge}</span> : ''
                            }
                            {
                                item.light === true ? <span className="badge badge-light">{item.badge}</span> : ''
                            }
                            <h2>{item.text}</h2>
                            <span><i className="material-icons">date_range</i> {item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default Highlightsy;