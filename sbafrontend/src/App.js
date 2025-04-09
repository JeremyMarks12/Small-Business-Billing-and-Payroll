import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import AdminHomePage from './Components/AdminHomePage';
import WorkerHomePage from './Components/HomePage';
import InspectorProfiles from './Components/InspectorProfiles';
import CompanyProfiles from './Components/CompanyProfiles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/worker" element={<WorkerHomePage />} />
        
        <Route path="/admin" element={<AdminHomePage />}>
          <Route path="inspectors" element={<InspectorProfiles />} />
          <Route path="companies" element={<CompanyProfiles />} />
          {/* Routes for other sidebar tabs if we need it.  */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


