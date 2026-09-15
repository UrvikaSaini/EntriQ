import { useState } from "react";

import Navigation from "./Navigation.jsx";
import Navbar from "./Navbar.jsx";
import Visitor from "./Visitor.jsx";
import Dashboard from "./Dashboard.jsx";
import VisitorPass from "./VisitorPass.jsx";
import Profile from "./Profile.jsx";
import VisitorRequest from "./VisitorRequest.jsx";
import Parking from "../Parking.jsx";
import Complaints from "../Complaints.jsx";
import "./ResApp.css";
import "../ParkingComplaints.css";

function ResidentApp() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Parking data
  const [slots, setSlots] = useState(() => {
    const savedSlots = localStorage.getItem("parkingSlots");

    if (savedSlots) {
      return JSON.parse(savedSlots);
    }

    return [
      {
        id: "A1",
        status: "Occupied",
        vehicle: "PB10CD5678",
      },
      {
        id: "A2",
        status: "Available",
        vehicle: "",
      },
      {
        id: "A3",
        status: "Occupied",
        vehicle: "PB10AB1234",
      },
      {
        id: "A4",
        status: "Available",
        vehicle: "",
      },
      {
        id: "A5",
        status: "Occupied",
        vehicle: "PB10XY4567",
      },
      {
        id: "A6",
        status: "Available",
        vehicle: "",
      },
      {
        id: "A7",
        status: "Available",
        vehicle: "",
      },
      {
        id: "A8",
        status: "Occupied",
        vehicle: "PB10PQ7890",
      },
      {
        id: "A9",
        status: "Available",
        vehicle: "",
      },
      {
        id: "A10",
        status: "Available",
        vehicle: "",
      },
    ];
  });

  // Complaints data
  const [complaints, setComplaints] = useState(() => {
    const savedComplaints = localStorage.getItem("complaints");

    if (savedComplaints) {
      return JSON.parse(savedComplaints);
    }

    return [];
  });

  // Save parking changes
  function updateSlots(updatedSlots) {
    setSlots(updatedSlots);
    localStorage.setItem("parkingSlots", JSON.stringify(updatedSlots));
  }

  // Save complaint changes
  function updateComplaints(updatedComplaints) {
    setComplaints(updatedComplaints);
    localStorage.setItem(
      "complaints",
      JSON.stringify(updatedComplaints)
    );
  }

  return (
    <div className="resident-app">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        residentId={1}
      />

      <Navbar residentId={1}/>

      <main className="resident-main-content">
        {activeTab === "dashboard" && (
          <Dashboard residentId={1} />
        )}

        {activeTab === "myProfile" && (
          <Profile residentId={1} />
        )}

        {activeTab === "myVisitors" && (
          <Visitor residentId={1} />
        )}

        {activeTab === "visitorPass" && (
          <VisitorPass residentId={1} />
        )}

        {activeTab === "visitorRequest" && (
          <VisitorRequest residentId={1} />
        )}

        {activeTab === "parking" && (
          <Parking
            slots={slots}
            setSlots={updateSlots}
          />
        )}

        {activeTab === "complaints" && (
          <Complaints
            complaints={complaints}
            setComplaints={updateComplaints}
            role="resident"
          />
        )}
      </main>
    </div>
  );
}

export default ResidentApp;