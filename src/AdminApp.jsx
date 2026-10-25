
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

import { useDispatch, useSelector } from "react-redux";
import { fetchParkingSlots } from "./store/parkingSlice";
import { fetchComplaints } from "./store/complaintsSlice";

import {
  AdminProvider,
  useAdmin
} from "./context/AdminContext";

function AdminContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { admin } = useAdmin();

  useEffect(() => {
    dispatch(fetchParkingSlots());
    dispatch(fetchComplaints());
  }, [dispatch]);

  const slots = useSelector((state) => state.parking.slots);

  const complaints = useSelector(
    (state) => state.complaints.complaints
  );

  const [page, setPage] = useState("admin");

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
              Welcome back, {admin.name} 👋
            </p>
          </div>

          <div className="admin-profile">
            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>{admin.name}</strong>
              <span>{admin.role}</span>
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

        {page === "parking" && <Parking />}

        {page === "complaints" && (
          <Complaints role="admin" />
        )}
      </main>
    </div>
  );
}

function AdminApp() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}

export default AdminApp;
