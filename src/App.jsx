import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Units from './pages/Units';
import Leases from './pages/Leases';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="tenants/station/:stationId" element={<Tenants />} />
          <Route path="units" element={<Units />} />
          <Route path="leases" element={<Leases />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more routes here as needed */}
          <Route path="*" element={<div className="p-4 text-white">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
