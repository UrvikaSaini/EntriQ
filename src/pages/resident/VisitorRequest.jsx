import { useState, useEffect } from 'react';
import axios from 'axios';
import './VisitorRequest.css';
import { FaUserClock, FaCheck, FaTimes, FaShieldAlt, FaUser, FaHome } from 'react-icons/fa';

function VisitorRequest({ residentId = 1 }) {
  const [profile, setProfile] = useState({
    resName: '',
    email: '',
    unit: ''
  })
  const [errorMsg, setErrorMsg] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/visitor_requests/resident/${residentId}`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching visitor requests:', error);
      setLoading(false);
    }
  };

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
      fetchRequests();
    }
  }, [residentId]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/visitor_requests/${id}/status`, { status });
      fetchRequests(); // Refresh list after status update
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
    }
  };

  return (
    <div className="requests-container">
      <nav className="pass-nav">
        <div className="brand-logo">
          <FaShieldAlt className="logo-icon" />
          <span>EntriQ</span>
        </div>
        <h2><FaUserClock />Visitor Requests</h2>
      </nav>
      

      <div className="table-card">
        {loading ? (
          <div className="loading-state">Loading Gate Requests...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">No Pending Requests</div>
        ) : (
          <table className="visitors-table">
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Category</th>
                <th>Gate</th>
                <th>Guard ID</th>
                <th>Requested At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <strong>{req.visName}</strong>
                  </td>
                  <td>
                    <span className="category-tag">{req.type || 'Guest'}</span>
                  </td>
                  <td>{req.entryGate || 'Main Gate'}</td>
                  <td>
                    <FaShieldAlt /> Guard #{req.guardId || 1}
                  </td>
                  <td>
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'}
                  </td>
                  <td>
                    <span className={`status-badge ${(req.status || 'Pending').toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' ? (
                      <div className="action-buttons">
                        <button
                          className="action-btn checkin-btn"
                          onClick={() => handleStatusUpdate(req.id, 'Approved')}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="action-btn checkout-btn"
                          onClick={() => handleStatusUpdate(req.id, 'Denied')}
                        >
                          <FaTimes /> Deny
                        </button>
                      </div>
                    ) : (
                      <span className="completed-lbl">Responded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default VisitorRequest;