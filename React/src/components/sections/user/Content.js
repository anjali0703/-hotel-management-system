import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import toastr from "toastr";
import Swal from "sweetalert2";
import "react-data-table-component-extensions/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/toastr.min.css"
import "../../../App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import { ProgressSpinner } from 'primereact/progressspinner';
// import errorlog  from '../logs/errorlog.js';



toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

const Content = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userTypeId: "",
    mobile: "",
  });

  const [userTypes, setUserTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setshowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userdata, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
    GetData();
  }, []);

  /* const GetData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userTypeId = user ? user.userTypeId : "";
    const userID = user ? user.id : "";

    const endpoint = `${apiUrl}/users/allusers`

    setIsLoading(true);

    axios
      .get(endpoint)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }; */

  const GetData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userTypeId = user ? user.userTypeId : "";
    const userID = user ? user.id : "";

    const endpoint = `${apiUrl}/users/allusers`;

    setIsLoading(true);

    axios
      .get(endpoint)
      .then((response) => {
        // Filter the response data based on searchTerm, checking all fields
        const filteredData = response.data.filter((user) =>
          Object.values(user) // Convert object fields to an array of values
            .some((value) =>
              value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Search all fields
            )
        );
        setUserData(filteredData); // Set filtered data to the state
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // ErrorLog
      //  errorlog(null , null , `Error fetching user data : ${error}` , "GetData" , "React/src/components/sections/user" ,null);

      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Optional: Call GetData when searchTerm changes
  useEffect(() => {
    GetData();
    fetchUserTypes();
  }, [searchTerm]);

  const fetchUserTypes = async () => {
    const response = await fetch(`${apiUrl}/userTypes`);
    const data = await response.json();
    setUserTypes(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toastr.warning("Password and confirm password do not match.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toastr.warning("Please enter a valid email address");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const createdBy = user ? user.id : "";

    const formDataWithUserInfo = {
      ...formData,
      ...(isEditing
        ? { modifiedBy: user ? user.id : "" }
        : { createdBy }),
    };

    const apiCall = isEditing
      ? axios.put(`${apiUrl}/users/edit/${currentUserId}`, formDataWithUserInfo)
      : axios.post(`${apiUrl}/users/add`, formDataWithUserInfo);

    setIsLoading(true);

    apiCall
      .then((response) => {

        if (response.data.warning) {
          toastr.warning(response.data.warning); // Display the warning from backend
          return; // Prevent further submission if email already exists
        }
        const newUserId = isEditing ? currentUserId : response.data._id;

        // Userlog
        // userlog(newUserId ,user?user.id :null , isEditing ? user.id : null  ,`UserData ${isEditing ? "updated" : "added"} successfully` )

        toastr.success(`User ${isEditing ? "updated" : "added"} successfully`);
        setIsEditing(false);
        setCurrentUserId(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobile: "",
          userTypeId: "",
        });
        GetData();
        setshowModal(false);

      })
      .catch((error) => {
        console.error(
          `Error ${isEditing ? "updating" : "adding"} user:`,
          error
        );
        toastr.error(`Error ${isEditing ? "updating" : "adding"} user`);
        // ErrorLog
      //  errorlog(null , null , `Error ${isEditing ? "updating" : "adding"} userdata : ${error}` , "handleSubmit" , "React/src/components/sections/user" ,null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
      mobile: user.mobile,
      userTypeId: user.userTypeId?._id,
    });
    setCurrentUserId(user._id);
    setIsEditing(true);
    setshowModal(true);
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const user = JSON.parse(localStorage.getItem("user"));
        const deletedBy = user ? user.id : "";
        setIsLoading(true);
        axios
          .post(`${apiUrl}/users/delete`, {
            userId,
            deletedBy,
          })
          .then((response) => {
            toastr.success("Deleted!", "User has been deleted.");
            GetData();


          })
          .catch((error) => {
            console.error("Error deleting User:", error);
            toastr.error("Something went wrong please try again");
            // ErrorLog
            // errorlog(null , null , `Error deleting User : ${error}` , "handleDelete" , "React/src/components/sections/user" ,null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const handleAddButtonClick = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userTypeId: "",
      mobile: "",
      userTypeId: "",
    });
    setshowModal(true);
  };
  const handleClose = () => setshowModal(false);

  const data = userdata.map((item, index) => ({
    no: index + 1,
    Name:item.name,
    UserType:item.userTypeId ? item.userTypeId.usertype : "",
    Email:item.email,
    Mobile:item.mobile,
    Edit:<span
          title="Edit"
          onClick={() => handleEdit(item)}
          className="icon-bg-primary curser-pointer"
          style={{ cursor: "pointer" }}
        >
          <i className="fa-regular fa-pen-to-square fa-lg pl-2" style={{ color: "#11c239" }}></i>
        </span>,
    Delete:<span
            title="Delete"
            onClick={() => handleDelete(item._id)}
            className="text-danger"
            style={{ cursor: "pointer" }}
            >
            <i className="fas fa-trash" style={{ color: "#ee625d" }}></i>
          </span>,

}));



  return (
    <>
      <div className="app">
        <div>
          <header className="header">
            <h3 style={{ textAlign: 'left' }}>
              <b>User</b>
            </h3>
            {/* <div className="header-top">
              <div className="back-icon">
                <Link to="/LoginPage">
                  <i className="fa fa-fw fa-lg fa-sign-in-alt"
                    style={{ cursor: "pointer", color: "#53E88B", fontSize: "25px" }}
                  ></i>
                </Link>
              </div>
              <h6 className="header-table-cat restaurant-title">
                Table No: <span className="highlight">1</span>
              </h6>
            </div> */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
              <div className="search-bar" style={{ flex: "1", position: "relative" }}>
                <i className="fa fa-fw fa-lg fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="search-bar" style={{ flexShrink: "0" }}>
                <button className="search-button" onClick={handleAddButtonClick}>
                <i
                                    className="bi bi-plus-lg h4"
                                    style={{ cursor: "pointer", color: "#DA6317" }}
                                ></i>
                </button>
              </div>
            </div>




          </header>

          <div className=" table-bordered table " style={{ marginTop: '15px', maxHeight: '600px', overflow: 'auto' ,textAlign:"left" }}>
                  <DataTable value={data} stripedRows paginator rows={10} tableStyle={{ minWidth: "50rem"  }}  emptyMessage="No records found."
                  loading={isLoading}
                  loadingIcon={isLoading ?<ProgressSpinner style={{ width: "50px", height: "50px" }}  />: ''}
                    >
                    <Column field="no"         header="Sr. No"         className='primeBody'            headerClassName='text-center' />
                    <Column field="Name"       header="Name"           className='primeBody '           headerClassName='text-center' />
                    <Column field="UserType"   header="UserType"       className='primeBody'            headerClassName='text-center'/>
                    <Column field="Email"      header="Email"          className='primeBody'            headerClassName='text-center'/>
                    <Column field="Mobile"     header="Mobile"         className='primeBody'            headerClassName='text-center'/>
                    <Column field="Edit"       header="Edit"           className='primeBody'            headerClassName='text-center'/>
                    <Column field="Delete"     header="Delete"         className='primeBody'            headerClassName='text-center'/>
                </DataTable>

                </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
      >
        <Modal.Header className="p-2 px-4">
          <h4 className="modal-title has-icon p-0">
            <i className="fa fa-edit" />
            {isEditing ? "Edit User" : "Add User"}
          </h4>
          <button type="button" className="close" onClick={handleClose}>
          <i className="bi bi-x-lg h4 text-dark"></i>
          </button>
        </Modal.Header>
        <Modal.Body>
          <form className="row g-3 p-0 px-2" onSubmit={handleSubmit}>
            <div className="col-md-6 mt-2">
              <label htmlFor="name" className="form-label mb-1 mb-1">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mt-2">
              <label htmlFor="email" className="form-label mb-1">
                Email
              </label>
              <div className="input-group m-0 p-0">
                <div className="input-group-prepend">
                  <div className="input-group-text"><i className="fa-solid fa-envelope"></i></div>
                </div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                  required
                />
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <label htmlFor="password" className="form-label mb-1">
                Password
              </label>
              <div className="input-group p-0 m-0">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text" onClick={handleTogglePassword} style={{ cursor: 'pointer', borderRadius: '0' }} >
                  {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </span>
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <label htmlFor="confirmPassword" className="form-label mb-1">
                Confirm Password
              </label>
              <div className="input-group p-0 m-0">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span className="input-group-text" onClick={handleToggleConfirmPassword} style={{ cursor: 'pointer', borderRadius: '0' }} >
                  {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                </span>
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <label htmlFor="UserType" className="form-label mb-1">
                User Type
              </label>
              <div className="input-group m-0 p-0">
                <select
                  name="userTypeId"
                  value={formData.userTypeId}
                  onChange={handleChange}
                  id="asisStatus"
                  className="form-select form-control"
                  required
                >
                  <option value="">Select User Type</option>
                  {userTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.usertype}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6 mt-2">
              <label htmlFor="mobile" className="form-label mb-1">
                Mobile
              </label>
              <div className="input-group m-0 p-0">
                <div className="input-group-prepend">
                  <div className="input-group-text"><i className="fa-solid fa-phone"></i></div>
                </div>

                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only digits and ensure length is <= 10
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      handleChange(e);  // Update state only if it's valid
                    }
                  }}
                  required
                />

              </div>
            </div>

            <div className="d-flex justify-content-end align-items-center col-12">
              <button type="submit" className="btn btn-primary p-2">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-light ml-2 p-2"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Content;