import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaParking,
  FaClipboardList,
  FaUserShield,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Admin from "./pages/Admin";
import Parking from "./pages/Parking";
import Complaints from "./pages/Complaints";

import "./AdminApp.css";

function AdminApp() {

  const navigate = useNavigate();

  const [page, setPage] = useState("admin");

  // PARKING DATA
  const [slots, setSlots] = useState(() => {

    const savedSlots = localStorage.getItem("parkingSlots");

    if (savedSlots) {
      return JSON.parse(savedSlots);
    }

    return [
      { id: "A1", status: "Occupied", vehicle: "PB10CD5678" },
      { id: "A2", status: "Available", vehicle: "" },
      { id: "A3", status: "Occupied", vehicle: "PB10AB1234" },
      { id: "A4", status: "Available", vehicle: "" },
      { id: "A5", status: "Occupied", vehicle: "PB10XY4567" },

      { id: "B1", status: "Available", vehicle: "" },
      { id: "B2", status: "Occupied", vehicle: "PB10MN9876" },
      { id: "B3", status: "Available", vehicle: "" },
      { id: "B4", status: "Available", vehicle: "" },
      { id: "B5", status: "Occupied", vehicle: "PB10PQ3456" },

      { id: "C1", status: "Occupied", vehicle: "PB10AA1111" },
      { id: "C2", status: "Available", vehicle: "" },
      { id: "C3", status: "Occupied", vehicle: "PB10BB2222" },
      { id: "C4", status: "Available", vehicle: "" },
      { id: "C5", status: "Available", vehicle: "" },

      { id: "D1", status: "Occupied", vehicle: "PB10CC3333" },
      { id: "D2", status: "Available", vehicle: "" },
      { id: "D3", status: "Occupied", vehicle: "PB10DD4444" },
      { id: "D4", status: "Available", vehicle: "" },
      { id: "D5", status: "Occupied", vehicle: "PB10EE5555" }
    ];
  });


  // COMPLAINT DATA
  const [complaints, setComplaints] = useState(() => {

    const savedComplaints = localStorage.getItem("complaints");

    if (savedComplaints) {
      return JSON.parse(savedComplaints);
    }

    return [
      {
        id: 1,
        name: "Rahul Sharma",
        flatNo: "A-204",
        complaint: "Water supply issue in Block A",
        status: "Pending"
      },
      {
        id: 2,
        name: "Simran Kaur",
        flatNo: "B-103",
        complaint: "Street light is not working",
        status: "Resolved"
      }
    ];
  });


  // SAVE PARKING DATA
  useEffect(() => {
    localStorage.setItem(
      "parkingSlots",
      JSON.stringify(slots)
    );
  }, [slots]);


  // SAVE COMPLAINT DATA
  useEffect(() => {
    localStorage.setItem(
      "complaints",
      JSON.stringify(complaints)
    );
  }, [complaints]);


  const handleLogout = () => {
    navigate("/");
  };


  return (
    <div className="admin-app">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">

          <div className="admin-logo-icon">
            <FaShieldAlt />
          </div>

          <div>
            <h2>EntriQ</h2>
            <span>Admin Portal</span>
          </div>

        </div>


        <div className="admin-menu-title">
          MAIN MENU
        </div>


        <nav className="admin-nav">

          {/* ADMIN DASHBOARD */}
          <button
            className={
              page === "admin"
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
            onClick={() => setPage("admin")}
          >
            <FaUserShield />
            <span>Admin Dashboard</span>
          </button>


          {/* PARKING */}
          <button
            className={
              page === "parking"
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
            onClick={() => setPage("parking")}
          >
            <FaParking />
            <span>Parking</span>
          </button>


          {/* COMPLAINTS */}
          <button
            className={
              page === "complaints"
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
            onClick={() => setPage("complaints")}
          >
            <FaClipboardList />
            <span>Complaints</span>
          </button>

        </nav>


        {/* LOGOUT */}
        <div className="admin-sidebar-bottom">

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* TOP BAR */}
        <header className="admin-navbar">

          <div>
            <h1>
              {page === "admin" && "Admin Dashboard"}
              {page === "parking" && "Parking"}
              {page === "complaints" && "Complaints"}
            </h1>

            <p>
              Welcome back, Admin 👋
            </p>
          </div>


          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        {page === "admin" && (
          <Admin
            slots={slots}
            complaints={complaints}
          />
        )}


        {page === "parking" && (
          <Parking
            slots={slots}
            setSlots={setSlots}
          />
        )}


        {page === "complaints" && (
          <Complaints
            complaints={complaints}
            setComplaints={setComplaints}
            role="admin"
          />
        )}

      </main>

    </div>
  );
}

export default AdminApp;