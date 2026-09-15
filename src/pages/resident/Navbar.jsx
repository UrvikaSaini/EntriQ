import { FaShieldAlt } from "react-icons/fa";
import {useState,useEffect} from 'react'
import axios from 'axios';
 
function Navbar({residentId=1}) {
  const [profile,setProfile]=useState({
    resName: '',
    unit: ''
  });
  const [errorMsg,setErrorMsg]=useState("");
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
  useEffect(()=>{
    if(residentId){
      fetchProfile();
    }
  },[residentId]);
  return (
    <header className="resident-top-navbar">
      <div className="resident-top-brand">
        <FaShieldAlt />
        <span>EntriQ</span>
      </div>
      <div className="resident-top-profile">

        <div className="resident-avatar">
            {profile.resName ? profile.resName.charAt(0).toUpperCase() : 'R'}
        </div>
        <div className="resident-top-user-info">
          <strong>{profile.resName || "Resident"}</strong>
          <span>{profile.unit || "N/A"}</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;