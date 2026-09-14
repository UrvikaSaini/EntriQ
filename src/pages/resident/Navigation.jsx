import {
  FaHome,
  FaUser,
  FaUsers,
  FaPlus,
  FaTicketAlt,
  FaBell,
  FaShieldAlt,
    FaParking,
  FaFileAlt,
} from "react-icons/fa";

import { useState } from "react";

function Navigation({
  activeTab,
  setActiveTab,
  pendingRequestCount = 1
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
      id: "createVisitors",
      label: "Create Visitors",
      icon: <FaPlus />
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
      badge: pendingRequestCount
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

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        className="resident-mobile-toggle-btn"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? "×" : "☰"}
      </button>

      {isMobileOpen && (
        <div
          className="resident-sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`resident-sidebar ${
          isMobileOpen ? "resident-mobile-open" : ""
        }`}
      >
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
                className={`resident-nav-item ${
                  isActive ? "active" : ""
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
            <div className="resident-avatar">A</div>

            <div className="resident-user-info">
              <p className="resident-user-name">
                Shanaya Kapoor
              </p>

              <p className="resident-user-unit">
                Unit A-101
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navigation;