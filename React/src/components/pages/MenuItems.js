import React, { Component, Fragment} from 'react';
import MetaTags from "react-meta-tags";
import Navbar from '../layouts/AdminNavbar';

import Recentactivity from '../layouts/Recentactivity';
import Setting from '../layouts/Setting';
import Sidenav from '../layouts/Sidenav';
import Content from '../sections/menuitems/Content';

class User extends Component {

    navToggle = () => {
        document.getElementById("body").classList.toggle("ms-aside-left-open");
        document.getElementById("ms-side-nav").classList.toggle("ms-aside-open");
        document.getElementById("overlayleft").classList.toggle("d-block");
    };

    render() {

        const user = localStorage.getItem("user");

        // ✅ IF NO USER → ONLY MENU
        if (!user) {
            return (
                <Fragment>
                    <MetaTags>
                        <title>MenuItem</title>
                    </MetaTags>

                    <Content />
                </Fragment>
            );
        }

        // ✅ IF USER EXISTS → FULL ADMIN PANEL
        return (
            <Fragment>
                <MetaTags>
                    <title>MenuItem</title>
                    <meta name="description" content="#" />
                </MetaTags>

                <div className="body ms-body ms-aside-left-open ms-primary-theme ms-has-quickbar" id="body">
                    <Setting />
                    <Sidenav />
                    <Recentactivity />

                    <main className="body-content">
                        <Navbar />
                        <Content />
                    </main>
                </div>
            </Fragment>
        );
    }
}

export default User;