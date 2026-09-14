import { useState } from "react";
import "./ParkingComplaints.css";

function ParkingIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 19V5h7a4 4 0 0 1 0 8H9" />
      <path d="M9 9h4a1 1 0 0 0 0-2H9v2Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 16l1-5 2-4h8l2 4 1 5" />
      <path d="M4 16h16v3H4z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function Parking({ slots, setSlots }) {

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const availableSlots = slots.filter(
    (slot) => slot.status === "Available"
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "Occupied"
  ).length;


  function addVehicle() {

    if (!selectedSlot) {
      alert("Please select a parking slot");
      return;
    }

    if (vehicleNumber.trim() === "") {
      alert("Please enter vehicle number");
      return;
    }

    const updatedSlots = slots.map((slot) => {

      if (slot.id === selectedSlot.id) {
        return {
          ...slot,
          status: "Occupied",
          vehicle: vehicleNumber.trim().toUpperCase()
        };
      }

      return slot;
    });

    setSlots(updatedSlots);

    setSelectedSlot({
      ...selectedSlot,
      status: "Occupied",
      vehicle: vehicleNumber.trim().toUpperCase()
    });

    setVehicleNumber("");
  }


  function removeVehicle() {

    if (!selectedSlot) {
      return;
    }

    const updatedSlots = slots.map((slot) => {

      if (slot.id === selectedSlot.id) {
        return {
          ...slot,
          status: "Available",
          vehicle: ""
        };
      }

      return slot;
    });

    setSlots(updatedSlots);

    setSelectedSlot({
      ...selectedSlot,
      status: "Available",
      vehicle: ""
    });
  }


  function searchVehicleSlot() {

    if (searchVehicle.trim() === "") {
      setSearchResult(null);
      return;
    }

    const foundSlot = slots.find(
      (slot) =>
        slot.vehicle &&
        slot.vehicle.toLowerCase() ===
        searchVehicle.trim().toLowerCase()
    );

    setSearchResult(foundSlot || "not found");
  }


  return (

    <div className="parking-page">


      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Parking Management</h1>

          <p>
            Manage your society parking and vehicles.
          </p>
        </div>

      </div>


      {/* HERO */}

      <div className="dashboard-hero">

        <div className="hero-content">

          <span className="hero-small">
            PARKING CONTROL CENTER
          </span>

          <h2>
            Smart parking,
            <br />
            <span>simple management.</span>
          </h2>

          <p className="hero-description">
            Manage parking spaces and vehicles from one place.
          </p>

        </div>

        <div className="hero-icon">
          <ParkingIcon />
        </div>

      </div>


      {/* STAT CARDS */}

      <div className="stats">


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon-box">
              <ParkingIcon />
            </div>

            <span>PARKING</span>

          </div>

          <div className="stat-number">
            {slots.length}
          </div>

          <p>Total Parking Slots</p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon-box available-icon">
              <CheckIcon />
            </div>

            <span>AVAILABLE</span>

          </div>

          <div className="stat-number">
            {availableSlots}
          </div>

          <p>Available Slots</p>

        </div>


        <div className="stat-card">

          <div className="stat-top">

            <div className="stat-icon-box occupied-icon">
              <CarIcon />
            </div>

            <span>OCCUPIED</span>

          </div>

          <div className="stat-number">
            {occupiedSlots}
          </div>

          <p>Occupied Slots</p>

        </div>

      </div>


      {/* FIND VEHICLE */}

      <div className="vehicle-search">

        <div className="section-heading">

          <div>

            <h2>Find Vehicle</h2>

            <p>
              Search for a vehicle using its registration number.
            </p>

          </div>

          <span className="section-icon">
            <SearchIcon />
          </span>

        </div>


        <div className="search-box">

          <input
            type="text"
            placeholder="Enter vehicle number"
            value={searchVehicle}
            onChange={(e) => {
              setSearchVehicle(e.target.value);
              setSearchResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchVehicleSlot();
              }
            }}
          />

          <button onClick={searchVehicleSlot}>
            Search
          </button>

        </div>


        {searchResult &&
          searchResult !== "not found" && (

            <p className="search-result">

              Vehicle{" "}
              <b>{searchResult.vehicle}</b>{" "}
              is parked in Slot{" "}
              <b>{searchResult.id}</b>.

            </p>

        )}


        {searchResult === "not found" && (

          <p className="not-found">
            Vehicle not found.
          </p>

        )}

      </div>


      {/* PARKING SECTION */}

      <div className="parking-section">


        {/* PARKING LAYOUT */}

        <div className="parking-layout-container">

          <div className="section-heading">

            <div>

              <h2>Parking Layout</h2>

              <p>
                Select a slot to view or manage it.
              </p>

            </div>

          </div>


          <div className="parking-legend">

            <div>
              <span className="legend-box available-box"></span>
              Available
            </div>

            <div>
              <span className="legend-box occupied-box"></span>
              Occupied
            </div>

          </div>


          <div className="parking-grid">

            {slots.map((slot) => (

              <div
                key={slot.id}
                className={`slot ${slot.status.toLowerCase()} ${
                  selectedSlot?.id === slot.id
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSlot(slot);
                  setVehicleNumber("");
                }}
              >

                <div className="slot-number">
                  {slot.id}
                </div>

                <p>
                  {slot.status}
                </p>

                {slot.status === "Occupied" && (
                  <small>
                    Vehicle parked
                  </small>
                )}

              </div>

            ))}

          </div>

        </div>


        {/* SLOT DETAILS */}

        <div className="slot-details-container">

          {selectedSlot ? (

            <div className="slot-details">

              <div className="details-icon">
                <ParkingIcon />
              </div>

              <h2>
                Slot Details
              </h2>


              <div className="detail-row">

                <span>Slot</span>

                <b>
                  {selectedSlot.id}
                </b>

              </div>


              <div className="detail-row">

                <span>Status</span>

                <b
                  className={
                    selectedSlot.status === "Occupied"
                      ? "detail-occupied"
                      : "detail-available"
                  }
                >
                  {selectedSlot.status}
                </b>

              </div>


              {selectedSlot.status === "Occupied" ? (

                <div>

                  <div className="detail-row">

                    <span>Vehicle</span>

                    <b>
                      {selectedSlot.vehicle}
                    </b>

                  </div>

                  <button
                    className="remove-button"
                    onClick={removeVehicle}
                  >
                    Remove Vehicle
                  </button>

                </div>

              ) : (

                <div className="add-vehicle">

                  <label>
                    Vehicle Number
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. PB10AB1234"
                    value={vehicleNumber}
                    onChange={(e) =>
                      setVehicleNumber(e.target.value)
                    }
                  />

                  <button onClick={addVehicle}>
                    Add Vehicle
                  </button>

                </div>

              )}

            </div>

          ) : (

            <div className="slot-details empty-details">

              <div className="details-icon">
                <ParkingIcon />
              </div>

              <h2>
                Slot Details
              </h2>

              <p>
                Select a parking slot to view
                its details.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Parking;