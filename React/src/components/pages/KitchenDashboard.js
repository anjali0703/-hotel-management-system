
import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Navbar from '../layouts/AdminNavbar';
// import Quickbar from '../layouts/Quickbar';
import Recentactivity from '../layouts/Recentactivity';
import Setting from '../layouts/Setting';
import Sidenav from '../layouts/Sidenav';
import Content from '../sections/KichenDashBoard/Content';

class Home extends Component {
    render() {
             const user = localStorage.getItem("user");
               const roleId = user?.userTypeId;
             const isKitchen = roleId === process.env.REACT_APP_ROLE_KITCHEN;
               if (!isKitchen) {
            return (
                <Fragment>
                    <MetaTags>
                        <title>Kichen</title>
                    </MetaTags>
                    
                    <Content />
                </Fragment>
            );
        }

        return (
            <Fragment>
                <MetaTags>
                    <title>Kichen</title>
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

export default Home;