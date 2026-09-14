import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaEdit, FaSave, FaTimes ,FaShieldAlt} from 'react-icons/fa';

function Profile({ residentId }) {
  const [profile, setProfile] = useState({
    resName: '',
    email: '',
    phoneno: '',
    unit: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setErrorMsg('');
      const res = await axios.get(`http://localhost:5000/api/resident/${residentId}`);
      if (res.data) {
        setProfile(res.data);
        setFormData(res.data);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/resident/${residentId}`, formData);
      setProfile(formData);
      setIsEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <nav className="res-navbar">
        <div className="brand-logo">
          <FaShieldAlt className="logo-icon" />
          <span>EntriQ</span>
        </div>
        <h2>My Profile</h2>   
      </nav>
      
      <div className="res-profile-info">
          <div className="avatar">
            {profile.resName ? profile.resName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="res-name">{profile.resName || 'Resident'}</h2>
      </div>

      <div className="res-profile-card">
        {errorMsg && <div className="alert-danger" style={{ color: 'red', margin: '10px 0' }}>{errorMsg}</div>}
        {message && <div className="alert-success" style={{ color: 'green', margin: '10px 0' }}>{message}</div>}

        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div>
                <label>NAME</label>
                <p>{profile.resName || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <label>EMAIL</label>
                <p>{profile.email || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <label>PHONE NUMBER</label>
                <p>{profile.phoneno || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaHome className="detail-icon" />
              <div>
                <label>UNIT</label>
                <p>{profile.unit || 'Not Provided'}</p>
              </div>
            </div>
            <div className="profile-edit-btn">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSave}>
            <label>Full Name</label>
            <input
              type="text"
              name="resName"
              value={formData.resName || ''}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phoneno"
              value={formData.phoneno || ''}
              onChange={handleChange}
              required
            />

            <label>Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit || ''}
              onChange={handleChange}
              required
            />

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FaSave /> Save
              </button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;



/*import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function Profile({residentId=1}) {
  const [profile, setProfile] = useState({
    resName: '',
    email: '',
    phoneno: '',
    unit: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setErrorMsg('');
      const res = await axios.get(`http://localhost:5000/api/resident/${residentId}`);
      if (res.data) {
        // Map response to match existing profile state keys
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error in Fetching Profile:', error);
      setErrorMsg('Failed to load profile. Check backend connection.');
    }
  };

  useEffect(() => {
    if (residentId) {
      fetchProfile();
    }
  }, [residentId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/resident/${residentId}`, formData);
      setProfile(formData);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMsg('Failed to update profile.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">
            {profile?.resName ? profile.resName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2>{profile?.resName || 'Loading...'}</h2>
            <span className="unit-badge">Unit {profile?.unit || 'N/A'}</span>
          </div>
        </div>


        {message && <div className="alert alert-success">{message}</div>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}


        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <FaUser className="detail-icon" />
              <div>
                <label>FULL NAME</label>
                <p>{profile?.resName || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <label>EMAIL</label>
                <p>{profile?.email || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <label>PHONE NUMBER</label>
                <p>{profile?.phoneno || 'Not Provided'}</p>
              </div>
            </div>

            <div className="detail-item">
              <FaHome className="detail-icon" />
              <div>
                <label>UNIT</label>
                <p>{profile?.unit || 'Not Provided'}</p>
              </div>
            </div>

            <button
              className="edit-btn"
              onClick={() => {
                setFormData(profile);
                setIsEditing(true);
              }}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSave}>
            <label>Full Name</label>
            <input
              type="text"
              name="resName"
              value={formData.resName || ''}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phoneno"
              value={formData.phoneno || ''}
              onChange={handleChange}
              required
            />

            <label>Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit || ''}
              onChange={handleChange}
              required
            />

            <div className="form-actions">
              <button type="submit" className="btn-save">
                <FaSave /> Save
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;*/