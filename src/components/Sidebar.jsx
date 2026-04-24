import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, CreditCard,
  Warehouse, BarChart3, Settings, ChevronDown, ChevronRight, Building2
} from 'lucide-react';

const Sidebar = () => {
  const [stations, setStations]       = useState([]);
  const [tenantsOpen, setTenantsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/stations')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        // Rename to Station 1, 2, 3… ordered alphabetically
        const sorted = data.sort((a,b) => a.name.localeCompare(b.name));
        setStations(sorted);
      })
      .catch(() => {});
  }, []);

  // Auto-open Tenants submenu if on a tenants route
  useEffect(() => {
    if (location.pathname.startsWith('/tenants')) setTenantsOpen(true);
  }, [location.pathname]);

  const mainItems = [
    { name: 'Dashboard', path: '/',        icon: LayoutDashboard },
    { name: 'Leases',    path: '/leases',  icon: FileText },
    { name: 'Payments',  path: '/payments', icon: CreditCard },
    { name: 'Units',     path: '/units',   icon: Warehouse },
    { name: 'Reports',   path: '/reports', icon: BarChart3 },
    { name: 'Settings',  path: '/settings', icon: Settings },
  ];

  const isTenantsActive = location.pathname.startsWith('/tenants');

  return (
    <aside className="sidebar desktop-only">
      {/* Logo */}
      <div className="logo-container flex-col items-center mb-xl text-center">
        <div className="logo-icon"><Warehouse size={24} /></div>
        <span className="logo-text mt-sm">StationHub</span>
      </div>

      <nav className="nav-menu">
        {/* Dashboard */}
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} className="nav-icon" /> Dashboard
        </NavLink>

        {/* Tenants (collapsible) */}
        <div>
          <button
            onClick={() => setTenantsOpen(p => !p)}
            className={`nav-item w-full flex justify-between ${isTenantsActive ? 'active' : ''}`}
            style={{ textAlign: 'left', width: '100%' }}
          >
            <span className="flex items-center gap-md">
              <Users size={18} className="nav-icon" /> Tenants
            </span>
            {tenantsOpen
              ? <ChevronDown size={14} className="text-muted" />
              : <ChevronRight size={14} className="text-muted" />
            }
          </button>

          {/* Child: All Tenants + per-Station */}
          {tenantsOpen && (
            <div style={{ marginTop: '2px' }}>
              {/* Semua Tenant */}
              <NavLink
                to="/tenants"
                end
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={{ fontSize: '0.85rem', padding: '7px 14px', paddingLeft: '20px' }}
              >
                <Users size={15} className="nav-icon text-muted" /> Semua Tenant
              </NavLink>

              {/* Stations — indented with left border */}
              <div style={{
                marginLeft: '20px',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
                paddingLeft: '10px',
              }}>
                {stations.map(s => (
                  <NavLink
                    key={s.id}
                    to={`/tenants/station/${s.id}`}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  >
                    <Building2 size={14} className="nav-icon" style={{ opacity: 0.6 }} /> {s.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Other main items */}
        {mainItems.slice(1).map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" /> {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
