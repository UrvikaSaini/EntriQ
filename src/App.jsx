import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import GuardRoutes from "./routes/GuardRoutes";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");

  // =========================
  // PARKING STATE
  // =========================
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

  // Save parking changes
  useEffect(() => {
    localStorage.setItem("parkingSlots", JSON.stringify(slots));
  }, [slots]);

  // =========================
  // COMPLAINTS STATE
  // =========================
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

  // Save complaints changes
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  // =========================
  // SIDEBAR MENU
  // =========================
  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
      path: "/guard-dashboard"
    },
    {
      name: "QR Scanner",
      icon: "▣",
      path: "/scanner"
    },
    {
      name: "Visitors",
      icon: "♙",
      path: "/visitor"
    },
    {
      name: "Entry Logs",
      icon: "↘",
      path: "/entry-logs"
    },
    {
      name: "Exit Logs",
      icon: "↗",
      path: "/exit-logs"
    },
    {
      name: "Parking",
      icon: "P",
      path: "/parking"
    },
    {
      name: "Complaints",
      icon: "⚠",
      path: "/complaints"
    }
  ];

  const handleNavigation = (item) => {
    setActive(item.name);
    navigate(item.path);
  };

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">
            <FaShieldAlt />
          </div>

          <div>
            <h2>EntriQ</h2>
            <span>Guard Portal</span>
          </div>
        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                active === item.name ? "active" : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              <span className="menu-icon">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout"
            onClick={() => navigate("/")}
          >
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}
      <main className="main">

        {/* NAVBAR */}
        <header className="navbar">

          <div className="page-title">
            <h1>{active}</h1>
            <p>Welcome back, Guard 👋</p>
          </div>

          <div className="nav-right">

            <button className="notification">
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="profile">

              <div className="avatar">
                G
              </div>

              <div className="profile-info">
                <strong>Guard</strong>
                <span>Security Staff</span>
              </div>

              <span className="arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>

        {/* =========================
            GUARD ROUTES
        ========================= */}
        <GuardRoutes
          slots={slots}
          setSlots={setSlots}
          complaints={complaints}
          setComplaints={setComplaints}
        />

      </main>

    </div>
  );
}

export default App;