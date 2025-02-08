import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserType from './pages/UserType';
import ProjectList from './pages/ProjectList';
import CollaborationSpace from './pages/CollaborationSpace';
import Dashboard from './pages/dashboard/DashSales';
import CaseDetailsPage from "./pages/CaseDetailsPage";
import DisputeForm from './pages/DisputeForm';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/user-type" />} />
          <Route path="/user-type" element={<UserType />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/collaboration/:projectId" element={<CollaborationSpace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/disputedetails" element={<CaseDetailsPage />} />
          <Route path="/disputeForm" element={<DisputeForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}