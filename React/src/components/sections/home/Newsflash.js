import React, { Component } from 'react';
import Slider from 'react-slick';

const news = [
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
    {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In non dui purus. Mauris id lacinia turpis'
    },
]

class Newsflash extends Component {
    render() {
        const settings = {
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            autoplay: true,
            autoplaySpeed: 0,
            speed: 10000,
            cssEase: 'linear',
            variableWidth: true,
            pauseOnHover: true
        }
        return (
            <div className="col-md-12">
                <div className="ms-panel">
                    <div className="ms-panel-body ms-news-flash-container">
                        <div className="ms-news-update">
                            <span>News Update</span>
                        </div>
                        <Slider id="news-flash" {...settings}>
                            {news.map((item, i) => (
                                <li key={i}>
                                    <p>{item.title}</p>
                                </li>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

export default Newsflash;