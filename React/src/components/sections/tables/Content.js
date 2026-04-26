import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useNavigate, useLocation } from "react-router-dom";
const Content = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    Tnumber: "",
    capacity: "",
    status: "Available",
    active: true
  });

  const [tableData, setTableData] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [qrMap, setQrMap] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  // ================= GET DATA =================
  const GetData = () => {
    setIsLoading(true);
    axios.get(`${apiUrl}/tables`)
      .then(res => {
        setTableData(res.data.data);
      })
      .catch(() => toastr.error("Error fetching tables"))
      .finally(() => setIsLoading(false));
  };

useEffect(() => {
  GetData();
}, []);

useEffect(() => {
  tableData.forEach((t) => {
    if (!qrMap[t.Tnumber]) {
      fetchQR(t.Tnumber);
    }
  });
}, [tableData]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const fetchQR = async (tableNo) => {
  try {
    const res = await axios.get(`${apiUrl}/tables/qr/${tableNo}`);
    setQrMap((prev) => ({
      ...prev,
      [tableNo]: res.data.qr
    }));
  } catch (err) {
    console.error("QR error", err);
  }
};
  const handleTableSelect = (table) => {
  if (table.status === "Occupied") {
    toastr.warning("Table already occupied");
    return;
  }

  // ✅ Save table
  localStorage.setItem("tableNo", table.Tnumber);

  // ✅ Get redirect params
  const params = new URLSearchParams(location.search);
  const itemId = params.get("redirectItem");
  const category = params.get("category");

  // ✅ Redirect back to menu
  if (itemId) {
    navigate(`/MenuItems?item=${itemId}&category=${category}`);
  } else {
    navigate("/MenuItems");
  }
};

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.Tnumber || !formData.capacity) {
      toastr.warning("All fields required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : "";

    const payload = {
      ...formData,
      userId,
      ...(isEditing && { id: currentId })
    };

    setIsLoading(true);

    axios.post(`${apiUrl}/tables/save`, payload)
      .then(() => {
        toastr.success(`Table ${isEditing ? "updated" : "added"} successfully`);
        GetData();
        setshowModal(false);
        setIsEditing(false);
        setFormData({
          Tnumber: "",
          capacity: "",
          status: "Available",
          active: true
        });
      })
      .catch(() => toastr.error("Error saving table"))
      .finally(() => setIsLoading(false));
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setFormData({
      Tnumber: row.Tnumber,
      capacity: row.capacity,
      status: row.status,
      active: row.active
    });
    setCurrentId(row._id);
    setIsEditing(true);
    setshowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true
    }).then((res) => {
      if (res.isConfirmed) {
        const user = JSON.parse(localStorage.getItem("user"));
        axios.delete(`${apiUrl}/tables/${id}`, {
          data: { userId: user?.id }
        }).then(() => {
          toastr.success("Deleted");
          GetData();
        });
      }
    });
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = (row) => {
    const newStatus = row.status === "Available" ? "Occupied" : "Available";

    axios.post(`${apiUrl}/tables/save`, {
      id: row._id,
      status: newStatus
    }).then(() => {
      toastr.success("Status updated");
      GetData();
    });
  };

  // ================= TABLE DATA =================
const filteredData = tableData.filter((item) => {
  const term = searchTerm.toLowerCase();

  return (
    String(item.Tnumber || "").toLowerCase().includes(term) ||
    String(item.capacity || "").includes(term) ||
    String(item.status || "").toLowerCase().includes(term)
  );
});

const data = filteredData.map((item, index) => ({
  ...item, // ✅ IMPORTANT
  no: index + 1,
  statusUI: (
    <span
      onClick={(e) => {
        e.stopPropagation(); // stop row click
        toggleStatus(item);
      }}
      style={{
        cursor: "pointer",
        color: "#fff",
        background: item.status === "Available" ? "#1d8719" : "#dc3545",
        padding: "5px 10px",
        borderRadius: 10,
      }}
    >
      {item.status}
    </span>
  ),
   active: item.active ? "Yes" : "No",
  Edit: (
    <span onClick={() => handleEdit(item)} style={{ cursor: "pointer" }}>
      <i className="fa-regular fa-pen-to-square" style={{ color: "#11c239" }}></i>
    </span>
  ),
  Delete: (
    <span onClick={() => handleDelete(item._id)} style={{ cursor: "pointer" }}>
      <i className="fas fa-trash" style={{ color: "#ee625d" }}></i>
    </span>
  )
}));
  const handleClose = () => setshowModal(false);
  const openQRModal = (qr, tableNo) => {
  setSelectedQR(qr);
  setSelectedTable(tableNo);
  setShowQRModal(true);
};

const downloadQR = () => {
  const link = document.createElement("a");
  link.href = selectedQR;
  link.download = `Table-${selectedTable}-QR.png`;
  link.click();
};

const shareQR = async () => {
  try {
    if (navigator.share) {
      // ✅ MOBILE (native share popup)
      await navigator.share({
        title: `Table ${selectedTable}`,
        text: "Scan to order food",
        url: selectedQR
      });
    } 
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      <div className="app">
         <header className="header">
            <h3 style={{ textAlign: 'left' }}>
              <b>Tables</b>
            </h3>
          
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
                <button className="search-button"onClick={() => setshowModal(true)}>
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
                         loadingIcon={isLoading ?<ProgressSpinner style={{ width: "50px", height: "50px" }}   />: ''}
                           >
          <Column field="no" header="Sr. No" className='primeBody'            headerClassName='text-center'/>
          <Column field="Tnumber" header="Table No" className='primeBody'            headerClassName='text-center'/>
          <Column field="capacity" header="Capacity" className='primeBody'            headerClassName='text-center'/>
          <Column field="statusUI" header="Status"className="happy"           headerClassName='text-center' />
        <Column
  header="QR Code"
  body={(row) => (
    qrMap[row.Tnumber] ? (
<img
  src={qrMap[row.Tnumber]}
  alt="QR"
  width="60"
  style={{ cursor: "pointer" }}
  onClick={(e) => {
    e.stopPropagation();
    openQRModal(qrMap[row.Tnumber], row.Tnumber);
  }}
/>
    ) : (
      "Loading..."
    )
  )}
/>
          <Column field="Edit" header="Edit" className='primeBody'            headerClassName='text-center'/>
          <Column field="Delete" header="Delete" className='primeBody'            headerClassName='text-center'/>
        </DataTable>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setshowModal(false)}>
        <Modal.Header>
                  <h4 className="modal-title has-icon p-0">
            <i className="fa fa-edit" />
            {isEditing ? "Edit Table" : "Add Table"}
          </h4>
          <button type="button" className="close" onClick={handleClose}>
          <i className="bi bi-x-lg h4 text-dark"></i>
          </button>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
              <label htmlFor="table" className="form-label mb-1 mb-1"> 
                Table No.
              </label>
            <input
              className="form-control mb-2"
              name="Tnumber"
              placeholder="Table Number"
              value={formData.Tnumber}
              onChange={handleChange}
            />
 <label htmlFor="capacity" className="form-label mb-1">
                Capacity
              </label>
            <input
              className="form-control mb-2"
              name="capacity"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={handleChange}
            />

            <div className="radio-group">
  <label>
    <input
      type="radio"
      name="status"
      value="Available"
      checked={formData.status === "Available"}
      onChange={handleChange}
    />
    Available
  </label>

  <label style={{ marginLeft: "10px" }}>
    <input
      type="radio"
      name="status"
      value="Occupied"
      checked={formData.status === "Occupied"}
      onChange={handleChange}
    />
    Occupied
  </label>
</div>

       

  <div className="d-flex justify-content-end align-items-center col-12">
              <button className="btn btn-primary p-2">Save</button>
              <button type="button" className="btn btn-light ml-2 p-2" onClick={() => setshowModal(false)}>Cancel</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
  <Modal.Header closeButton>
    <h5>Table {selectedTable} QR Code</h5>
  </Modal.Header>

  <Modal.Body style={{ textAlign: "center" }}>
    <img src={selectedQR} alt="QR" style={{ width: "250px" }} />

    <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
      <button className="btn btn-success" onClick={downloadQR}>
        Download
      </button>

      <button className="btn btn-primary" onClick={shareQR}>
        Share
      </button>
    </div>
  </Modal.Body>
</Modal>
    </>
  );
};

export default Content;