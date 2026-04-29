import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Activity, History, Settings } from 'lucide-react';

const Layout = () => {
  return (
    <div className="app-container">
      <nav className="sidebar">
        <h2 className="sidebar-title">NutriScan AI</h2>
        
        <NavLink 
          to="/screening" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Activity size={20} />
          <span>Screening</span>
        </NavLink>
        
        <NavLink 
          to="/history" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <History size={20} />
          <span>History</span>
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
