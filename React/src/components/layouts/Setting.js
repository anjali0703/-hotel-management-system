import React, { Component, Fragment } from "react";
import classNames from "classnames";

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingtoggle: false,
    };
    this.settingToggle = this.settingToggle.bind(this);
  }
  // Setting toggle
  settingToggle() {
    this.setState({
      settingtoggle: !this.state.settingtoggle,
    });
  }
  darkMode = () => {
    document.getElementById("body").classList.toggle("ms-dark-theme");
  };
  quickbar = () => {
    document.getElementById("body").classList.toggle("ms-has-quickbar");
  };
  render() {
    return (
      <Fragment>
        {/* <div
          className={classNames("ms-toggler ms-settings-toggle ms-d-block-lg", {
            active: this.state.settingtoggle,
          })}
          onClick={this.settingToggle}
        >
          <i className="flaticon-paint" />
        </div> */}
        <div
          className={classNames("ms-settings-panel ms-d-block-lg", {
            open: this.state.settingtoggle,
          })}
        >
          <div className="row">
            <div className="col-xl-4 col-md-4">
              <h4 className="section-title">Customize</h4>
              <div>
                <label className="ms-switch">
                  <input
                    type="checkbox"
                    id="dark-mode"
                    onClick={() => this.darkMode()}
                  />
                  <span className="ms-switch-slider round" />
                </label>
                <span> Dark Mode </span>
              </div>
              <div>
                <label className="ms-switch">
                  <input
                    type="checkbox"
                    id="remove-quickbar"
                    onClick={() => this.quickbar()}
                  />
                  <span className="ms-switch-slider round" />
                </label>
                <span> Remove Quickbar </span>
              </div>
            </div>
            <div className="col-xl-4 col-md-4">
              <h4 className="section-title">Keyboard Shortcuts</h4>
              <p className="ms-directions mb-0">
                <code>Esc</code> Close Quick Bar
              </p>
              <p className="ms-directions mb-0">
                <code>Alt + (1 -&gt; 6)</code> Open Quick Bar Tab
              </p>
              <p className="ms-directions mb-0">
                <code>Alt + Q</code> Enable Quick Bar Configure Mode
              </p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Setting;
