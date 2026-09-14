import { useState } from 'react';
import axios from 'axios';
import './CreateVisitor.css';
import { FaUserPlus, FaUser, FaPhone, FaCar, FaTag ,FaShieldAlt} from 'react-icons/fa';

function CreateVisitor({ residentId = 1, onVisitorCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Guest',
    vehicle_no: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const targetResidentId = residentId || 1;

    const payload = {
      ...formData,
      residentId: targetResidentId,
      status: 'Expected',
      entryTime: null,
      exitTime: null
    };

    try {
      const res = await axios.put(`http://localhost:5000/api/visitors/${targetResidentId}`, payload);
      setMessage(res.data.message || 'Pass Generated & Visitor Logged as Expected!');

      setFormData({
        name: '',
        phone: '',
        type: 'Guest',
        vehicle_no: ''
      });

      if (onVisitorCreated) {
        onVisitorCreated(res.data);
      }
    } catch (err) {
      console.error("Error generating pass:", err);
      setError(err.response?.data?.error || "Failed to generate visitor pass.");
    }
  };

  return (
    <div className="create-visitor-container">
      <nav className="pass-nav">
        <div className="brand-logo">
          <FaShieldAlt className="logo-icon" />
          <span>EntriQ</span>
        </div>
        <h2>Create Visitor</h2>
      </nav>
      <div className="create-visitor-card">
        <h2><FaUserPlus /> Generate New Visitor Pass</h2>

        {message && <div className="success-alert">{message}</div>}
        {error && <div className="danger-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser /> Visitor Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number..."
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaTag /> Visitor Category</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Guest">Guest</option>
              <option value="Delivery">Delivery</option>
              <option value="Cab">Cab</option>
              <option value="Service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaCar /> Vehicle Number (Optional)</label>
            <input
              type="text"
              name="vehicle_no"
              placeholder="E.g. MH-02-AB-1234"
              value={formData.vehicle_no}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">Generate Pass</button>
        </form>
      </div>
    </div>
  );
}

export default CreateVisitor;