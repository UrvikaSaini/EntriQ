import { FaHome, FaUser, FaUsers, FaPlus, FaTicketAlt, FaBell, FaShieldAlt, FaParking, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from "react";

function Navigation({
  activeTab,
  setActiveTab,
  residentId = 1
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />
    },
    {
      id: "myProfile",
      label: "Profile",
      icon: <FaUser />
    },
    {
      id: "myVisitors",
      label: "Visitors",
      icon: <FaUsers />
    },
    {
      id: "visitorPass",
      label: "Visitor Pass",
      icon: <FaTicketAlt />
    },
    {
      id: "visitorRequest",
      label: "Visitor Request",
      icon: <FaBell />,
    },
    {
      id: "parking",
      label: "Parking",
      icon: <FaParking />,
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: <FaFileAlt />,
    },
  ];
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profile, setProfile] = useState({
    resName: '',
    unit: ''
  });
  const [errorMsg, setErrorMsg] = useState("");
  const handleSelect = (id) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };
  const handleLogout = () => {
    navigate("/");
  }
  const fetchProfile = async () => {
    try {
      setErrorMsg('');
      const res = await axios.get(`http://localhost:5000/api/resident/${residentId}`);
      if (res.data) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Error in Fetching Profile:", error);
      setErrorMsg("Failed to load profile. Check if backend is running and resident ID exists in database.");
    }
  };
  useEffect(() => {
    if (residentId) {
      fetchProfile();
    }
  }, [residentId]);
  return (
    <>
      <button
        className="resident-mobile-toggle-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? "X" : "☰"}
      </button>

      {isMobileOpen && (
        <div
          className="resident-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)} />
      )}

      <aside
        className={`resident-sidebar ${isMobileOpen ? "resident-mobile-open" : ""
          }`}>
        <div className="resident-sidebar-brand">
          <span className="resident-brand-logo">
            <FaShieldAlt />
          </span>
          <h1>EntriQ</h1>
        </div>
        <nav className="resident-sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`resident-nav-item ${isActive ? "active" : ""
                  }`}
                onClick={() => handleSelect(item.id)}
              >
                <span className="resident-nav-icon">
                  {item.icon}
                </span>

                <span className="resident-nav-label">
                  {item.label}
                </span>

                {item.badge > 0 && (
                  <span className="resident-nav-badge">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="resident-sidebar-footer">
          <div className="resident-user-profile-summary">
            <div className="resident-avatar">
              {profile.resName ? profile.resName.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="resident-user-info">
              <p className="resident-user-name">
                {profile.resName || "Resident"}
              </p>
              <p className="resident-user-unit">
                {profile.unit || "N/A"}
              </p>
            </div>
          </div>
          <div className="resident-logout">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>  Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navigation;