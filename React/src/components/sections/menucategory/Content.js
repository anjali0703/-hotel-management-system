import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import "react-data-table-component-extensions/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/toastr.min.css"
import "../../../App.css";
import { Modal } from "react-bootstrap";
import {

  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "./MenuCategory.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const MenuCategory = () => {
  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [showTrash, setShowTrash] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const apiUrl = process.env.REACT_APP_API_URL;
  const imgUrl = process.env.REACT_APP_IMAGE_URL;
    const navigate = useNavigate();
  const { user } = useAuth();

  const roleId = user?.userTypeId;

const isAdmin = roleId === process.env.REACT_APP_ROLE_ADMIN;


  useEffect(() => {
    fetchData();
    fetchDeleted();
  }, []);

  // ✅ ACTIVE DATA
  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/menuCategory`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TRASH DATA
  const fetchDeleted = async () => {
    try {
      const res = await axios.get(`${apiUrl}/menuCategory/deleted`);
      setDeletedCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(
          `${apiUrl}/menuCategory/update/${editingId}`,
          formData
        );
      } else {
        await axios.post(`${apiUrl}/menuCategory/add`, formData);
      }

      resetForm();
      fetchData();
      fetchDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setImage(null);
    setEditingId(null);
    setShowModal(false);
  };

  // ✅ DELETE (SOFT)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/menuCategory/delete/${id}`);
      fetchData();
      fetchDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ RESTORE
  const handleRestore = async (id) => {
    try {
      await axios.put(`${apiUrl}/menuCategory/restore/${id}`);
      fetchData();
      fetchDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ EDIT
  const handleEdit = (item) => {
     if (!isAdmin) return;

    setName(item.name);
    setEditingId(item._id);
    setShowModal(true);
  };

  // ✅ SEARCH FILTER
  const filteredData = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
const handleClose = () => {
  resetForm();
};
const handleCategoryClick = (item) => {
    navigate(`/MenuItems?${item.name}`);
};
  return (
    <>
    <div className="app">
           <header className="header">
            <h3 style={{ textAlign: 'left' }}>
              <b>Menu Category</b>
            </h3>
         
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%"}}>
              <div className="search-bar" style={{ flex: "1", position: "relative" }}>
                <i className="fa fa-fw fa-lg fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
                  {/* ONLY ADMIN CAN ADD */}
          {isAdmin && (<div className="d-flex" style={{gap:"10px"}}>
                <div className="search-bar" style={{ flexShrink: "0" ,gap:4}}>
                <button onClick={() => setShowTrash(false)}  className="add-btn" style={{ cursor: "pointer", color: "#DA6317" ,background:"none"}}>Active</button>
                </div>  <div className="search-bar" style={{ flexShrink: "0" ,gap:4}}>
                <button onClick={() => setShowTrash(true)}  className="add-btn" style={{ cursor: "pointer", color: "#DA6317" ,background:"none"}}>Trash</button>
            </div>
              <div className="search-bar" style={{ flexShrink: "0" }}>
                 <button className="add-btn" onClick={() => setShowModal(true)}>
                <i
                     className="bi bi-plus-lg h5"
                    style={{ cursor: "pointer", color: "#DA6317",background:"none" }}
                 ></i>
                </button>
        
              </div>
                     </div>
          )}
            </div>

          </header>

 

      {/* ✅ CARDS */}
      <div className="card-container">{(showTrash ? deletedCategories : filteredData).map((item) => (
 <div
  className="card"
  key={item._id}
  onClick={() => handleCategoryClick(item)}
  style={{cursor:"pointer"}}
>
    <img src={`${imgUrl}${item.image}`} alt="" />
    <h6>{item.name}</h6>

    <div className="card-actions">

      {/* ONLY ADMIN CAN SEE ACTIONS */}
      {isAdmin && (
        !showTrash ? (
          <>
            <FaEdit
              className="edit"
              onClick={() => handleEdit(item)}
            />
            <FaTrash
              className="delete"
              onClick={() => handleDelete(item._id)}
            />
          </>
        ) : (
          <button
            className="restore-btn"
            onClick={() => handleRestore(item._id)}
          >
            ♻ Restore
          </button>
        )
      )}

    </div>
  </div>
))}
      </div>
      </div>

      {/* ✅ MODAL */}
    {isAdmin && (        <Modal
  show={showModal}
  onHide={handleClose}
centered
      
      >
  <Modal.Header className="p-2 px-4 d-flex justify-content-between align-items-center">
    <h5 className="m-0">
      <i className="bi bi-pencil-square me-2 p-2"></i>
      {editingId ? "Edit Menu Category" : "Add Menu Category"}
    </h5>

    <button type="button" className="close" onClick={handleClose}>
          <i className="bi bi-x-lg h4 text-dark"></i>
          </button>
  </Modal.Header>

  <Modal.Body>
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Menu Category</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Menu Category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Select File</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="submit" className="btn btn-primary">
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
</Modal>)}
        </>
        
  
  );
};

export default MenuCategory;