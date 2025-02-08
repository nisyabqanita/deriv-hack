import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="sidebar bg-dark text-white vh-100 position-fixed">
      <div className="sidebar-header p-3 text-center">
        <h5>DashboardKit</h5>
      </div>
      <Nav defaultActiveKey="/dashboard" className="flex-column p-3">
        <Nav.Link href="/dashboard" className="text-white">
          <i className="bi bi-house-door-fill"></i> Dashboard
        </Nav.Link>
        <Nav.Link href="/elements" className="text-white">
          <i className="bi bi-stack"></i> UI Components
        </Nav.Link>
        <Nav.Link href="/pages" className="text-white">
          <i className="bi bi-file-earmark"></i> Pages
        </Nav.Link>
        <Nav.Link href="/other" className="text-white">
          <i className="bi bi-three-dots"></i> Other
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
