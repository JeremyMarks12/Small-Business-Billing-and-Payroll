import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import { AdminRoute, ProtectedRoute, PublicRoute } from './Components/ProtectedRoute';

// Public pages
import LoginPage from './Components/LoginPage';
import UnauthorizedPage from './Components/UnauthorizedPage';

// Admin pages
import AdminHomePage from './Components/AdminHomePage';
import AssignWork from './Components/AssignWork';
import AdminViewWork from './Components/AdminViewWork';
import CompanyProfiles from './Components/CompanyProfiles';
import InspectorProfiles from './Components/InspectorProfiles';
import ProfileTab from './Components/ProfileTab';
import WorkOrderFunctions from './Components/WorkOrderFunctions';
import WorkOrderDetail from './Components/WorkOrderDetail';
import MyWorkOrders from './Components/MyWorkOrders';
import MyWorkOrderDetail from './Components/MyWorkOrderDetail';

// Worker pages
import HomePage from './Components/HomePage';
import InspectorAssignedWork from './Components/InspectorAssignedWork';
import InspectorBillingPage from './Components/InspectorBillingPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminHomePage />}>
              <Route index element={<div>Welcome to the Admin Dashboard</div>} />
              <Route path="assign" element={<AssignWork />} />
              <Route path="viewwork" element={<AdminViewWork />} />
              <Route path="companies" element={<CompanyProfiles />} />
              <Route path="inspectors" element={<InspectorProfiles />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="my-workorders" element={<MyWorkOrders />} />
              <Route path="my-workorders/:workOrderID" element={<MyWorkOrderDetail />} />
			  <Route path="workorders" element={<WorkOrderFunctions />} />
              <Route path="workorders/:workOrderID" element={<WorkOrderDetail />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>

          {/* Worker Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/worker" element={<HomePage />}>
              <Route index element={<div>Welcome to the Worker Dashboard</div>} />
              <Route path="assigned" element={<InspectorAssignedWork />} />
              <Route path="my-workorders" element={<MyWorkOrders />} />
              <Route path="my-workorders/:workOrderID" element={<MyWorkOrderDetail />} />
              <Route path="billing" element={<InspectorBillingPage />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="*" element={<Navigate to="/worker" replace />} />
            </Route>
          </Route>

          {/* Catch All Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
