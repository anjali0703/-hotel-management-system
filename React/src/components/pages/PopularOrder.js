import React, { Component, Fragment} from 'react';
import MetaTags from "react-meta-tags";
import Navbar from '../layouts/AdminNavbar';

import Recentactivity from '../layouts/Recentactivity';
import Setting from '../layouts/Setting';
import Sidenav from '../layouts/Sidenav';
import Content from '../sections/PopularOrder/Content';

class User extends Component {
    navToggle = () => {
        document.getElementById("body").classList.toggle("ms-aside-left-open");
        document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
        document.getElementById("overlayleft").classList.toggle("d-block");
    };
    render() {

        return (
            <Fragment>
                <MetaTags>
                    <title>Popular Orders</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body ms-body ms-aside-left-open ms-primary-theme ms-has-quickbar" id="body">
                    <Setting />
                    <Sidenav />
                    <Recentactivity />
                    <main className="body-content">
                        <Navbar />
                        <Content />
                    </main>
                    {/* <Quickbar/> */}
                </div>
            </Fragment>
        );
    }
}

export default User;