import React, { Component, Fragment,useEffect } from 'react';
import MetaTags from "react-meta-tags";
import Navbar from '../layouts/Navbar';
import Quickbar from '../layouts/Quickbar';
import Recentactivity from '../layouts/Recentactivity';
import Setting from '../layouts/Setting';
import Sidenav from '../layouts/Sidenav';
import Content from '../sections/home/Content';
import { Link } from "react-router-dom";

class Home extends Component {
    navToggle = () => {
        document.getElementById("body").classList.toggle("ms-aside-left-open");
        document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
        document.getElementById("overlayleft").classList.toggle("d-block");
      };
    render() {
        
        return (
            <Fragment>
                <MetaTags> 
                    <title>Mystic | Homepage</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body ms-body ms-primary-theme ms-has-quickbar" id="body">
                {/* <div className="body ms-body ms-aside-left-open ms-primary-theme ms-has-quickbar" id="body"> */}
                    <Setting />
                    <Sidenav/>
                    <Recentactivity/>
                    <main className="body-content">
                        <Navbar/>
                        <Content/>
                    </main>
                    <Quickbar/>
                </div>
            </Fragment>
        );
    }
}

export default Home;