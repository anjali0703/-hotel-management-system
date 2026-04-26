import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";

const MenuModal = ({ isOpen, onClose, item, categories, refresh }) => {
 const API = process.env.REACT_APP_API_URL;
  const IMG_URL = process.env.REACT_APP_IMAGE_URL;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    menucategoryId: "",
    available: true
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // ✅ LOAD DATA
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        description: item.description || "",
        menucategoryId: item.menucategoryId?._id || "",
        available: item.available ?? true
      });

      // ✅ show old image
      if (item.image) {
        setPreview(`${IMG_URL}/uploads/${item.image}`);
      }
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        menucategoryId: "",
        available: true
      });
      setPreview(null);
      setFile(null);
    }
  }, [item, API]);

  // ✅ VALIDATION
  const validate = () => {
    let err = {};

    if (!formData.name.trim()) err.name = "Item name required";
    if (!formData.price || formData.price <= 0)
      err.price = "Enter valid price";
    if (!formData.menucategoryId)
      err.category = "Select category";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ FILE CHANGE
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };



  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (file) data.append("image", file);
    if (item) data.append("id", item._id);

    try {
      await axios.post(`${API}/menuItems/save`, data);
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        show={isOpen}
        onHide={onClose}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
      >
        <Modal.Header className="p-2 px-4 d-flex justify-content-between align-items-center">
          <h5 className="m-0">
            <i className="bi bi-pencil-square me-2 p-2"></i>
            {item ? "Edit Menu Item" : "Add Menu Item"}
          </h5>

          <button type="button" className="close" onClick={onClose}>
            <i className="bi bi-x-lg h4 text-dark"></i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit} className="modal-form">

            {/* NAME */}
            <label>Item Name</label>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* PRICE */}
            <div className="mb-3">
              <label>Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
              {errors.price && (
                <small className="text-danger">{errors.price}</small>
              )}
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label>Category</label>
              <select
                className="form-control"
                value={formData.menucategoryId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    menucategoryId: e.target.value
                  })
                }
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <small className="text-danger">{errors.category}</small>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                placeholder="Enter description"
                rows="2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />
            </div>

            {/* AVAILABILITY */}
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="available"
                  checked={formData.available === true}
                  onChange={() =>
                    setFormData({ ...formData, available: true })
                  }
                />
                Available
              </label>

              <label>
                <input
                  type="radio"
                  name="available"
                  checked={formData.available === false}
                  onChange={() =>
                    setFormData({ ...formData, available: false })
                  }
                />
                Not Available
              </label>
            </div>

            {/* IMAGE */}
            <div >
              <label>Image</label>
              <input
                className="form-control"
                type="file"
                onChange={handleFileChange}
              />
              <div className="d-flex justify-content-between ">

              {/* PREVIEW */}
              {preview && (
                <div className="mt-2 d-inline-block">
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "10px",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}
           

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2 align-items-center " >
              <button type="submit" className="btn btn-primary p-2"style={{height:"35px"}} >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-light ml-2 p-2 "
                onClick={onClose}
                style={{height:"35px"}}
              >
                Cancel
              </button>
            </div>
 </div>
 </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MenuModal;