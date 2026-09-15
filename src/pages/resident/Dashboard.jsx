import React, { useState, useEffect } from "react";
import axios from "axios";
import {FaUser, FaHome, FaBell, FaCheckCircle, FaTimesCircle, FaBoxOpen, FaClock, FaSync, FaDoorOpen, FaHistory, FaQrcode, FaPhoneAlt, FaEnvelope} from "react-icons/fa";
import "./Dashboard.css";

function Dashboard({ residentId = 1 }) {
  const currDateTime=new Date();
  const [activeTab, setActiveTab] = useState("overview");
  const [resident, setResident] = useState(null);
  const [stats, setStats] = useState({
    pendingCount: 0,
    activePassesCount: 0,
    insideCount: 0,
    totalTodayCount: 0
  });

  const [pendingRequests, setPendingRequests] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState({
    text: "",
    type: ""
  });
  const showBanner = (text, type) => {
    setActionMsg({ text, type });

    setTimeout(() => {
      setActionMsg({ text: "", type: "" });
    }, 4000);
  };
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [
        resProfile,
        resStats,
        resPending,
        resLogs
      ] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/resident/${residentId}`
        ),
        axios.get(
          `http://localhost:5000/api/resident/${residentId}/stats`
        ),
        axios.get(
          `http://localhost:5000/api/resident/${residentId}/pending_requests`
        ),
        axios.get(
          `http://localhost:5000/api/resident/${residentId}/visitor_logs`
        )
      ]);

      setResident(resProfile.data);
      setStats(resStats.data);
      setPendingRequests(resPending.data || []);
      setVisitorLogs(resLogs.data || []);
    } catch (error) {
      console.error(
        "Error fetching dashboard data:",
        error
      );

      showBanner(
        "Failed to refresh dashboard data from backend server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);

    return () => clearInterval(interval);
  }, [residentId]);

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/resident/request/${requestId}/status`,
        { status }
      );

      showBanner(
        `Gate request ${status.toLowerCase()} successfully!`,
        "success"
      );

      fetchDashboardData();
    } catch (error) {
      console.error(
        "Error processing request status:",
        error
      );

      showBanner(
        "Failed to update request status.",
        "error"
      );
    }
  };

  const getStatusBadge = (status) => {
    const currentStatus = (
      status || "Pending"
    ).toLowerCase();

    switch (currentStatus) {
      case "approved":
        return (
          <span className="dash-badge badge-approved">
            <FaCheckCircle />
            Approved
          </span>
        );

      case "denied":
        return (
          <span className="dash-badge badge-denied">
            <FaTimesCircle />
            Denied
          </span>
        );

      case "leave at gate":
      case "leave at gate":
        return (
          <span className="dash-badge badge-leave">
            <FaBoxOpen />
            Leave at Gate
          </span>
        );

      default:
        return (
          <span className="dash-badge badge-pending">
            <FaClock />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="res-dash-container">
      {actionMsg.text && (
        <div
          className={`dash-alert ${
            actionMsg.type === "error"
              ? "alert-error"
              : "alert-success"
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Page Header */}
      <div className="dash-sub-header">
        <div>
          <h1>
            Welcome Back, <span className="resident-name">{resident?.resName || "Resident"}!</span>
          </h1>

          <p>
            Manage Visitor Gate Permissions, View Live Arrivals,
            and Monitor History.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div
          className="stat-card pending-card"
          onClick={() => setActiveTab("overview")}>
          <div className="stat-icon">
            <FaBell />
          </div>

          <div className="stat-content">
            <h3>{stats.pendingCount}</h3>
            <p>Pending Gate Approvals</p>
          </div>
        </div>

        <div className="stat-card inside-card">
          <div className="stat-icon">
            <FaDoorOpen />
          </div>

          <div className="stat-content">
            <h3>{stats.insideCount}</h3>
            <p>Visitors Inside Unit</p>
          </div>
        </div>

        <div className="stat-card passes-card">
          <div className="stat-icon">
            <FaQrcode />
          </div>

          <div className="stat-content">
            <h3>{stats.activePassesCount}</h3>
            <p>Active Passes</p>
          </div>
        </div>

        <div className="stat-card total-card">
          <div className="stat-icon">
            <FaHistory />
          </div>

          <div className="stat-content">
            <h3>{stats.totalTodayCount}</h3>
            <p>Visits Recorded Today</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dash-tabs">
        <button
          type="button"
          className={`tab-btn ${
            activeTab === "overview" ? "active" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          <FaBell />
          Live Gate Requests ({pendingRequests.length})
        </button>

        <button
          type="button"
          className={`tab-btn ${
            activeTab === "history" ? "active" : ""
          }`}
          onClick={() => setActiveTab("history")}>
          <FaHistory />
          Visitor History Log
        </button>

        <button
          type="button"
          className={`tab-btn ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => setActiveTab("profile")}>
          <FaUser />
          My Flat Profile
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <section className="tab-section">
          <h2 className="section-title">
            Gate Approval Queue
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="empty-box">
              <FaCheckCircle className="empty-state-icon" />
              <p>No Pending Gate Approval Requests at the moment.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="request-card">
                  <div className="req-header">
                    <span
                      className={`req-type type-${(
                        request.type || "Guest"
                      ).toLowerCase()}`}>
                      {request.type || "Guest"}
                    </span>

                    <span className="gate-tag">
                      Gate: {request.entryGate || "Main Gate"}
                    </span>
                  </div>

                  <div className="req-body">
                    <h3>{request.visName}</h3>

                    <p className="time-info">
                      <FaClock />
                      Arrived:{" "}
                      {request.createdAt
                        ? new Date(
                            request.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "Not available"}
                    </p>
                  </div>

                  <div className="req-actions">
                    <button
                      type="button"
                      className="action-btn approve-btn"
                      onClick={() =>
                        handleRequestAction(
                          request.id,
                          "Approved"
                        )
                      }>
                      <FaCheckCircle />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="action-btn leave-btn"
                      onClick={() =>
                        handleRequestAction(
                          request.id,
                          "Leave At Gate"
                        )}>
                      <FaBoxOpen />
                      Leave at Gate
                    </button>

                    <button
                      type="button"
                      className="action-btn deny-btn"
                      onClick={() =>
                        handleRequestAction(
                          request.id,
                          "Denied"
                        )
                      }>
                      <FaTimesCircle />
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <section className="tab-section">
          <h2 className="section-title">
            Recent Gate Activity Log
          </h2>

          {visitorLogs.length === 0 ? (
            <div className="empty-box">
              <FaHistory className="empty-state-icon" />
              <p>No Past Visitor Recorded yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Visitor Name</th>
                    <th>Category</th>
                    <th>Entry Gate</th>
                    <th>Status</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                  </tr>
                </thead>

                <tbody>
                  {visitorLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="font-bold">
                        {log.visName}
                      </td>

                      <td>
                        <span
                          className={`type-pill type-${(
                            log.type || "Guest"
                          ).toLowerCase()}`}
                        >
                          {log.type || "Guest"}
                        </span>
                      </td>

                      <td>
                        {log.entryGate || "Main Gate"}
                      </td>

                      <td>
                        {getStatusBadge(log.status)}
                      </td>

                      <td>
                        {log.entryTime
                          ? new Date(
                              log.entryTime
                            ).toLocaleString()
                          : currDateTime.toLocaleString()}
                      </td>

                      <td>
                        {log.exitTime
                          ? new Date(
                              log.exitTime
                            ).toLocaleString()
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <section className="tab-section dash-profile-container">
          <h2 className="section-title">
            Resident & Flat Information
          </h2>

          {resident ? (
            <div className="profile-card">
              <div className="profile-row">
                <span className="p-label">
                  <FaUser />
                  Full Name:
                </span>

                <span className="p-value">
                  {resident.resName || "Not Provided"}
                </span>
              </div>

              <div className="profile-row">
                <span className="p-label">
                  <FaHome />
                  Flat Unit Number:
                </span>

                <span className="p-value">
                  {resident.unit || "Not Provided"}
                </span>
              </div>

              <div className="profile-row">
                <span className="p-label">
                  <FaPhoneAlt />
                  Phone Number:
                </span>

                <span className="p-value">
                  {resident.phoneno || "Not Provided"}
                </span>
              </div>

              <div className="profile-row">
                <span className="p-label">
                  <FaEnvelope />
                  Email Address:
                </span>

                <span className="p-value">
                  {resident.email || "Not Provided"}
                </span>
              </div>

              <div className="profile-row">
                <span className="p-label">
                  <FaClock />
                  Registered On:
                </span>

                <span className="p-value">
                  {resident.createdAt
                    ? new Date(
                        resident.createdAt
                      ).toLocaleDateString()
                    : "Not Provided"}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-box">
              <p>Resident profile information is unavailable.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Dashboard;