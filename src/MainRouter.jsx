import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/guard/LandingPage";
import App from "./App";
import AdminApp from "./AdminApp";
import ResidentApp from "./pages/resident/ResidentApp";

function MainRouter() {
  return (
    <Routes>
      {/* Main Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Resident Portal */}
      <Route
        path="/resident-dashboard"
        element={<ResidentApp />}
      />

      {/* Admin Portal */}
      <Route
        path="/admin-dashboard"
        element={<AdminApp />}
      />

      {/* Guard Portal */}
      <Route
        path="/*"
        element={<App />}
      />
    </Routes>
  );
}

export default MainRouter;