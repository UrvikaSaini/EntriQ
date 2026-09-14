import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./GuardDashboard.css";

function GuardDashboard() {

  const navigate = useNavigate();

  return (
    <section className="content">

      {/* Welcome Banner */}

      <div className="welcome">

        <div>

          <span className="welcome-label">
            SECURITY CONTROL CENTER
          </span>

          <h2>
            Keep your society
            <br />
            <span>safe & secure.</span>
          </h2>

          <p>
            Manage visitors, vehicles and entry verification
            from one place.
          </p>

        </div>

        <div className="shield">
            <FaShieldAlt />
        </div>

      </div>


      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon red">
              ♙
            </div>

            <span className="trend">
              +12%
            </span>

          </div>

          <h3>24</h3>
          <p>Visitors Today</p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon red">
              ▤
            </div>

            <span className="trend">
              +8%
            </span>

          </div>

          <h3>18</h3>
          <p>Vehicles Today</p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon red">
              ✓
            </div>

            <span className="safe">
              Safe
            </span>

          </div>

          <h3>42</h3>
          <p>Verified Entries</p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon red">
              ◷
            </div>

            <span className="pending">
              Active
            </span>

          </div>

          <h3>06</h3>
          <p>Pending Requests</p>

        </div>

      </div>


      {/* Quick Actions */}

      <div className="section-header">

        <div>

          <h2>Quick Actions</h2>

          <p>
            Frequently used security operations
          </p>

        </div>

      </div>


      <div className="actions-grid">


        {/* QR Scanner */}

        <button
          className="action-card"
          onClick={() => navigate("/scanner")}
        >

          <div className="action-icon scanner">
            ▣
          </div>

          <div>

            <h3>Scan QR Code</h3>

            <p>
              Verify visitor QR
            </p>

          </div>

          <span className="action-arrow">
            →
          </span>

        </button>


        {/* Visitor Verification */}

        <button
          className="action-card"
          onClick={() => navigate("/visitor")}
        >

          <div className="action-icon visitor">
            ♙
          </div>

          <div>

            <h3>Verify Visitor</h3>

            <p>
              Check visitor entry
            </p>

          </div>

          <span className="action-arrow">
            →
          </span>

        </button>


        {/* Entry Logs */}

        <button
          className="action-card"
          onClick={() => navigate("/entry-logs")}
        >

          <div className="action-icon entry-action">
            ↘
          </div>

          <div>

            <h3>Entry Logs</h3>

            <p>
              View today's entries
            </p>

          </div>

          <span className="action-arrow">
            →
          </span>

        </button>


        {/* Exit Logs */}

        <button
          className="action-card"
          onClick={() => navigate("/exit-logs")}
        >

          <div className="action-icon exit-action">
            ↗
          </div>

          <div>

            <h3>Exit Logs</h3>

            <p>
              View today's exits
            </p>

          </div>

          <span className="action-arrow">
            →
          </span>

        </button>

      </div>


      {/* Recent Activity */}

      <div className="section-header activity-heading">

        <div>

          <h2>Recent Activity</h2>

          <p>
            Latest security events
          </p>

        </div>


        <div className="recent-links">

          <button
            className="view-all"
            onClick={() => navigate("/entry-logs")}
          >
            Entry Logs →
          </button>

          <button
            className="view-all"
            onClick={() => navigate("/exit-logs")}
          >
            Exit Logs →
          </button>

        </div>

      </div>


      {/* Activity List */}

      <div className="activity-card">


        {/* Activity 1 */}

        <div className="activity">

          <div className="activity-icon red-bg">
            ✓
          </div>

          <div className="activity-info">

            <strong>
              Visitor Verified
            </strong>

            <span>
              Rahul Sharma • Flat A-204
            </span>

          </div>

          <div className="activity-time">

            <span className="status verified">
              Verified
            </span>

            <small>
              2 min ago
            </small>

          </div>

        </div>


        {/* Activity 2 */}

        <div className="activity">

          <div className="activity-icon red-bg">
            ↘
          </div>

          <div className="activity-info">

            <strong>
              Visitor Entry
            </strong>

            <span>
              Rahul Sharma • Flat A-204
            </span>

          </div>

          <div className="activity-time">

            <span className="status verified">
              Entry
            </span>

            <small>
              8 min ago
            </small>

          </div>

        </div>


        {/* Activity 3 */}

        <div className="activity">

          <div className="activity-icon red-bg">
            ↗
          </div>

          <div className="activity-info">

            <strong>
              Visitor Exit
            </strong>

            <span>
              Arjun Kapoor • Flat C-305
            </span>

          </div>

          <div className="activity-time">

            <span className="status verified">
              Exit
            </span>

            <small>
              15 min ago
            </small>

          </div>

        </div>

      </div>

    </section>
  );
}

export default GuardDashboard;

