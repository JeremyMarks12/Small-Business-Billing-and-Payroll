import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import AdminHomePage from './Components/AdminHomePage';
import WorkerHomePage from './Components/HomePage';
import InspectorProfiles from './Components/InspectorProfiles';
import CompanyProfiles from './Components/CompanyProfiles';
import ProfileTab from './Components/ProfileTab';
import AssignWork from './Components/AssignWork';
import InspectorAssignedWork from './Components/InspectorAssignedWork';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/worker" element={<WorkerHomePage />}>
          <Route path="profile" element={<ProfileTab />} /> {/* workers */}
          <Route path="assigned" element={<InspectorAssignedWork />} /> {/* View Work*/}
        </Route>
        <Route path="/admin" element={<AdminHomePage />}>
          <Route path="assign" element={<AssignWork />} /> {/* Assign Work route */}
          <Route path="inspectors" element={<InspectorProfiles />} />
          <Route path="companies" element={<CompanyProfiles />} />
          <Route path="profile" element={<ProfileTab />} /> {/* admins */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;



