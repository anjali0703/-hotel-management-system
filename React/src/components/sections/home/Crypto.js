import React, { Component } from 'react';
import Slider from 'react-slick';

const currency = [
    { icon: 'BTC', text: 'BTC $1,119' },
    { icon: 'LTC', text: 'LTC $1,119' },
    { icon: 'ETH', text: 'ETH $1,119' },
    { icon: 'PPC-alt', text: 'PPC $1,119' },
    { icon: 'ZEC-alt', text: 'ZEC $1,119' },
    { icon: 'XLM', text: 'XLM $1,119' },
    { icon: 'KOBO', text: 'KOBO $1,119' },
    { icon: 'ADA-alt', text: 'ADA $1,119' },
    { icon: 'AMP', text: 'AMP $1,119' },
    { icon: 'EOS-alt', text: 'EOS $1,119' },
];

class Crypto extends Component {
    render() {
        const settings = {
            dots: false,
            arrows: false,
            infinite: false,
            slidesToShow: 9,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 7,
                        slidesToScroll: 7,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        infinite: true,
                        dots: false
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 420,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }
            ]
        }
        return (
            <div className="col-md-12">
                <div className="ms-panel">
                    <Slider className="ms-panel-body p-0 ms-crypto-overview-slider" {...settings}>
                        {currency.map((item, i) => (
                            <div key={i} className="ms-crypto-overview">
                                <i className={"cc " + item.icon + ""} />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        );
    }
}

export default Crypto;