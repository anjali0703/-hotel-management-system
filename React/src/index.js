import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// CSS imports
import "bootstrap/dist/js/bootstrap.bundle.min"; // Import Bootstrap JS
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "cropperjs/dist/cropper.css";
import "toastr/build/toastr.min.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-data-table-component-extensions/dist/index.css";
import "driver.js/dist/driver.min.css";
import "./assets/vendors/iconic-fonts/flat-icons/flaticon.css";
import "./assets/vendors/iconic-fonts/cryptocoins/cryptocoins.css";
import "./assets/vendors/iconic-fonts/cryptocoins/cryptocoins-colors.css";
import "./assets/vendors/iconic-fonts/font-awesome/css/all.min.css";
import "./assets/css/style.css";



// Ensure the target container exists in your HTML file
const container = document.getElementById("mystic");
if (!container) {
  throw new Error("Target container is not a DOM element.");
}

// Create a root and render
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Report web vitals
reportWebVitals();
