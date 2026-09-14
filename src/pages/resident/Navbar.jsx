import { FaShieldAlt } from "react-icons/fa";

function Navbar() {
  return (
    <header className="resident-top-navbar">
      <div className="resident-top-brand">
        <FaShieldAlt />
        <span>EntriQ</span>
      </div>

      <div className="resident-top-profile">
        <div className="resident-top-avatar">R</div>

        <div className="resident-top-user-info">
          <strong>Resident</strong>
          <span>Unit A-101</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;