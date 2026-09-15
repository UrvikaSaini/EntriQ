import { useState, useEffect } from 'react';
import axios from 'axios';
import './Visitor.css';
import { FaSearch, FaUserCheck, FaClock, FaHistory, FaBan,FaShieldAlt } from 'react-icons/fa';

function Visitor({ residentId = 1 }) {
  const currDateTime=new Date();
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery && searchQuery.trim() !== '') params.search = searchQuery.trim();
      if (categoryFilter && categoryFilter !== 'all') params.category = categoryFilter;
      if (activeTab && activeTab !== 'all') params.status = activeTab;

      const response = await axios.get(`http://localhost:5000/api/resident/${residentId}/visitor_logs`, { params });
      setVisitors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error in Fetching Visitors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (residentId) {
      fetchVisitors();
    }
  }, [residentId, activeTab, categoryFilter]);

  // Action: Security marks arrival
  const handleCheckIn = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/visitors/${id}/entry`);
      fetchVisitors();
    } catch (err) {
      console.error("Error marking check-in:", err);
    }
  };

  // Action: Security marks departure
  const handleCheckOut = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/visitors/${id}/exit`);
      fetchVisitors();
    } catch (err) {
      console.error("Error marking check-out:", err);
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '--:--';
    return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="visitor-container">
      <div className="visitors-tabs">
        <button className={activeTab === 'all' ? 'tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('all')}>
          <FaHistory /> All Logs
        </button>
        <button className={activeTab === 'Approved' ? 'tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('Approved')}>
          <FaUserCheck /> Inside Now
        </button>
        <button className={activeTab === 'Expected' ? 'tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('Expected')}>
          <FaClock /> Expected
        </button>
        <button className={activeTab === 'Denied' ? 'tab-btn-active' : 'tab-btn'} onClick={() => setActiveTab('Denied')}>
          <FaBan /> Blocked/Denied
        </button>
      </div>

      <div className="filter-bar">
        <form onSubmit={(e) => { e.preventDefault(); fetchVisitors(); }} className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Name, Phone or Vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <select className="category-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Guest">Guest</option>
          <option value="Delivery">Delivery</option>
          <option value="Cab">Cab</option>
          <option value="Service">Service</option>
        </select>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-state">Loading Visitors History...</div>
        ) : visitors.length === 0 ? (
          <div className="empty-state">No Visitors Found</div>
        ) : (
          <table className="visitors-table">
            <thead>
              <tr>
                <th>Visitors</th>
                <th>Category</th>
                <th>Vehicle No.</th>
                <th>Date</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div className="visitor-info-cell">
                      <span className="avatar-circle">{(v.name || 'V').charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{v.name}</strong>
                        <small>{v.phone}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className={`category-tag ${(v.type || 'Guest').toLowerCase()}`}>{v.type || 'Guest'}</span></td>
                  <td>{v.vehicle_no || 'N/A'}</td>
                  <td>{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '--'}</td>
                  <td>{formatDateTime(v.entryTime) ?formatDateTime(v.entryTime): currDateTime.toLocaleString()}</td>
                  <td>{formatDateTime(v.exitTime)}</td>
                  <td>
                    <span className={`status-badge ${(v.status || 'Expected').toLowerCase().replace(/\s+/g, '-')}`}>
                      {v.status || 'Expected'}
                    </span>
                  </td>
                  <td>
                    {v.status === 'Expected' && (
                      <button onClick={() => handleCheckIn(v.id)} className="action-btn checkin-btn">Check In</button>
                    )}
                    {v.status === 'Approved' && !v.exitTime && (
                      <button onClick={() => handleCheckOut(v.id)} className="action-btn checkout-btn">Check Out</button>
                    )}
                    {v.exitTime && <span className="completed-lbl">Completed</span>}
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

export default Visitor;