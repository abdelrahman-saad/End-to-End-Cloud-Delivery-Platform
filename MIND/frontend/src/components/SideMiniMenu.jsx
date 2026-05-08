import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

function SideMiniMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Determine active item based on current route
  const getActiveIndex = () => {
    if (location.pathname === '/create-note') return 0;
    if (location.pathname === '/notes') return 1;
    if (location.pathname === '/starred') return 2;
    return 1; // Default to Home
  };
  const active = getActiveIndex();

  const icons = [
    { icon: <i className="fas fa-plus" />, label: "Add", path: "/create-note" },
    { icon: <i className="fas fa-home" />, label: "Home", path: "/notes" },
    { icon: <i className="fas fa-star" />, label: "Starred", path: "/starred" },
  ];

  const handleNavClick = (path, index) => {
    if (index === active) return;
    navigate(path);
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-screen py-2 px-0 select-none z-30">
      <div className="sidebar-glass flex flex-col items-center pt-3 pb-4 px-0 w-16 rounded-3xl shadow-xl mx-1 my-2 relative" style={{minHeight:'510px'}}>
        {icons.map((item, idx) => (
          <button
            key={idx}
            className={`sidebar-icon flex items-center justify-center w-11 h-11 ${idx === 0 ? 'mb-2' : idx === 1 ? 'my-1' : 'my-1'} rounded-xl text-xl hover:bg-sidebarHighlight transition
              ${active === idx ? "active" : "inactive"}`}
            aria-label={item.label}
            tabIndex={0}
            onClick={() => handleNavClick(item.path, idx)}
          >
            {item.icon}
          </button>
        ))}
        <div className="sidebar-separator mt-1 mb-2"></div>
        <div
          className="mt-2 mb-1 mx-auto sidebar-vertical-label text-xs font-medium tracking-wider text-sidebarInactive"
          style={{letterSpacing:'2px',lineHeight:'90%'}}
        >
          NOTES NAV
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end pb-4 pt-3">
        <div className="relative">
          {showLogoutConfirm && (
            <div className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg p-2 shadow-lg z-50 min-w-[120px]">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition text-left"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          )}
          <button
            className="sidebar-bottom-btn flex items-center justify-center w-16 h-14 ml-1 bg-sidebar rounded-3xl shadow-lg hover:bg-sidebarHighlight transition text-xl"
            aria-label="Settings"
            tabIndex={0}
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
        <div
          className="mt-1 mx-auto sidebar-vertical-label text-xs font-medium tracking-wider text-sidebarInactive"
          style={{letterSpacing:'1.3px',lineHeight:'80%'}}
        >
          SETTINGS
        </div>
      </div>
    </aside>
  );
}

export default SideMiniMenu;

