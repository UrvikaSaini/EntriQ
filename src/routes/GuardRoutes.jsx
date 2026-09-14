import { Routes, Route } from "react-router-dom";

import GuardDashboard from "../pages/guard/GuardDashboard";
import QRScanner from "../pages/guard/QRScanner";
import VisitorVerification from "../pages/guard/VisitorVerification";
import EntryLogs from "../pages/guard/EntryLogs";
import ExitLogs from "../pages/guard/ExitLogs";

import Parking from "../pages/Parking";
import Complaints from "../pages/Complaints";

function GuardRoutes({
  slots,
  setSlots,
  complaints,
  setComplaints
}) {
  return (
    <Routes>

      {/* Guard Dashboard */}
      <Route
        path="/guard-dashboard"
        element={<GuardDashboard />}
      />

      {/* QR Scanner */}
      <Route
        path="/scanner"
        element={<QRScanner />}
      />

      {/* Visitors */}
      <Route
        path="/visitor"
        element={<VisitorVerification />}
      />

      {/* Entry Logs */}
      <Route
        path="/entry-logs"
        element={<EntryLogs />}
      />

      {/* Exit Logs */}
      <Route
        path="/exit-logs"
        element={<ExitLogs />}
      />

      {/* Parking */}
      <Route
        path="/parking"
        element={
          <Parking
            slots={slots}
            setSlots={setSlots}
          />
        }
      />

      {/* Complaints */}
      <Route
        path="/complaints"
        element={
          <Complaints
            complaints={complaints}
            setComplaints={setComplaints}
            role="guard"
          />
        }
      />

    </Routes>
  );
}

export default GuardRoutes;