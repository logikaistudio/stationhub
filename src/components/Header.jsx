import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="main-header">
      <h2>Welcome back, Admin</h2>
      
      <div className="header-right flex items-center gap-md">
        <div className="search-bar-container glass">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <button className="btn-icon glass"><Bell size={18} /></button>
        <div className="avatar-small">AD</div>
      </div>
    </header>
  );
};

export default Header;
