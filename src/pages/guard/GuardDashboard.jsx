
import { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { guardApi } from "../../services/guardApi";
import "./GuardDashboard.css";

function GuardDashboard() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [exits, setExits] = useState([]);
  const [pending, setPending] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard information from the backend
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setError("");

        const [dashboardResponse, entriesResponse, exitsResponse] =
          await Promise.all([
            guardApi.getDashboard(),
            guardApi.entryLogs(),
            guardApi.exitLogs(),
          ]);

        const dashboard = dashboardResponse.data;

        setEntries(
          Array.isArray(entriesResponse.data)
            ? entriesResponse.data
            : []
        );

        setExits(
          Array.isArray(exitsResponse.data)
            ? exitsResponse.data
            : []
        );

        setPending(Number(dashboard.pendingVisitors) || 0);
        setTotalVehicles(Number(dashboard.totalVehicles) || 0);
      } catch (err) {
        console.error("Dashboard loading failed:", err);
        setError(
          "Unable to load dashboard data. Please check the backend connection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Check whether a date belongs to today
  const isToday = (value) => {
    if (!value) return false;

    const date = new Date(value);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toDateString() === new Date().toDateString()
    );
  };

  const todayEntries = entries.filter((record) =>
    isToday(record.entry_time)
  );

  const todayExits = exits.filter((record) =>
    isToday(record.exit_time)
  );

  const todayVisitors = new Set(
    todayEntries
      .map((record) => record.visitor_id)
      .filter((id) => id !== null && id !== undefined)
  ).size;

  // Prepare the latest entry and exit activities
  const recentActivity = [
    ...entries
      .filter((record) => record.entry_time)
      .map((record) => ({
        ...record,
        activityType: "Entry",
        activityDate: record.entry_time,
      })),

    ...exits
      .filter((record) => record.exit_time)
      .map((record) => ({
        ...record,
        activityType: "Exit",
        activityDate: record.exit_time,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.activityDate).getTime() -
        new Date(a.activityDate).getTime()
    )
    .slice(0, 5);

  const formatTime = (value) => {
    if (!value) return "Time unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString([], {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Scroll to Saved Visitor Requests
  // Navigate to Visitor Verification and scroll to Saved Visitor Requests
const scrollToPendingRequests = () => {
  navigate("/visitor", {
    state: { scrollTo: "pending-requests" },
  });
};
  return (
    <section className="guard-dashboard">
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

      {/* Loading and Error Messages */}
      {loading && (
        <p>Loading dashboard data from database...</p>
      )}

      {!loading && error && (
        <p role="alert">{error}</p>
      )}

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon red">♙</div>
          </div>

          <h3>{loading ? "..." : todayVisitors}</h3>
          <p>Visitors Today</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon red">▤</div>
          </div>

          <h3>{loading ? "..." : totalVehicles}</h3>
          <p>Vehicles Registered</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon red">✓</div>
            <span className="safe">Database</span>
          </div>

          <h3>{loading ? "..." : todayEntries.length}</h3>
          <p>Entries Today</p>
        </div>

        {/* Clickable Pending Requests Card */}
        <div
          className="stat-card clickable-stat"
          onClick={scrollToPendingRequests}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToPendingRequests();
            }
          }}
        >
          <div className="stat-top">
            <div className="stat-icon red">◷</div>
            <span className="pending">Pending</span>
          </div>

          <h3>{loading ? "..." : pending}</h3>
          <p>Pending Requests</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <div>
          <h2>Quick Actions</h2>
          <p>Frequently used security operations</p>
        </div>
      </div>

      <div className="actions-grid">
        <button
          className="action-card"
          onClick={() => navigate("/scanner")}
        >
          <div className="action-icon scanner">▣</div>
          <div>
            <h3>Scan QR Code</h3>
            <p>Verify visitor QR</p>
          </div>
          <span className="action-arrow">→</span>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/visitor")}
        >
          <div className="action-icon visitor">♙</div>
          <div>
            <h3>Verify Visitor</h3>
            <p>Check visitor entry</p>
          </div>
          <span className="action-arrow">→</span>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/entry-logs")}
        >
          <div className="action-icon entry-action">↘</div>
          <div>
            <h3>Entry Logs</h3>
            <p>View saved entries</p>
          </div>
          <span className="action-arrow">→</span>
        </button>

        <button
          className="action-card"
          onClick={() => navigate("/exit-logs")}
        >
          <div className="action-icon exit-action">↗</div>
          <div>
            <h3>Exit Logs</h3>
            <p>View saved exits</p>
          </div>
          <span className="action-arrow">→</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="section-header activity-heading">
        <div>
          <h2>Recent Activity</h2>
          <p>Latest saved entry and exit records</p>
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
        {loading ? (
          <div className="activity">
            <div className="activity-info">
              <strong>Loading recent activity...</strong>
            </div>
          </div>
        ) : error ? (
          <div className="activity">
            <div className="activity-info">
              <strong>Activity unavailable</strong>
              <span>{error}</span>
            </div>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="activity">
            <div className="activity-info">
              <strong>No activity recorded yet</strong>
              <span>
                Database entry and exit records will appear here.
              </span>
            </div>
          </div>
        ) : (
          recentActivity.map((record, index) => (
            <div
              className="activity"
              key={`${record.activityType}-${record.id || index}`}
            >
              <div className="activity-icon red-bg">
                {record.activityType === "Entry" ? "↘" : "↗"}
              </div>

              <div className="activity-info">
                <strong>Visitor {record.activityType}</strong>
                <span>
                  {record.visitor_name || "Visitor name unavailable"}
                  {" • "}
                  {record.flat_number || "Flat unavailable"}
                </span>
              </div>

              <div className="activity-time">
                <span className="status verified">
                  {record.activityType}
                </span>

                <small>{formatTime(record.activityDate)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default GuardDashboard;
