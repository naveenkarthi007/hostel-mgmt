import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, Users, CheckSquare, List, Calendar, FileText, Database, Settings, HelpCircle, DollarSign, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/students', label: 'All Students', icon: Users },
  { to: '/rooms', label: 'Rooms Listing', icon: List },
  { to: '/allocations', label: 'Room Allocation', icon: CheckSquare },
  { to: '/complaints', label: 'Report', icon: FileText },
  { to: '/notices', label: 'Announcement', icon: Calendar },
];

function NavItem({ to, label, icon: Icon, onClick, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between px-6 py-2.5 text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? 'bg-[#7D53F6]/10 text-[#7D53F6] border-l-4 border-[#7D53F6]'
            : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </NavLink>
  );
}

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeItem = NAV.find(item => (item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)));
  const pageTitle = 'Administrator Dashboard';

  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-white shadow-[2px_0_15px_rgba(0,0,0,0.03)] lg:flex">
        <div className="flex h-[80px] items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {/* Quick logo mock for Bannari Amman Institute of Technology */}
            <div className="h-10 w-10 bg-[#7D53F6] rounded-lg flex items-center justify-center text-white font-bold text-xs">BIT</div>
            <div className="leading-tight">
              <div className="text-[14px] font-bold text-gray-900">Bannari Amman</div>
              <div className="text-[12px] font-semibold text-gray-600">Inst. of Tech</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 custom-scrollbar">
          {NAV.map(item => (
            <NavItem key={item.to + item.label} {...item} end={item.to === '/'} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-[#7D53F6]/10 hover:text-[#7D53F6] transition-colors rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-[250px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-[80px] items-center justify-between bg-[#F5F6F8] px-6 lg:px-8 pt-4 pb-2">
          <div className="flex w-full items-center justify-between rounded-xl bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(open => !open)}
                className="lg:hidden text-gray-500"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-800">{pageTitle}</span>
              </div>
            </div>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
            <div className="relative w-[250px] bg-white flex flex-col">
              <div className="flex h-[80px] items-center px-6 border-b border-gray-100">
                <div className="font-bold text-gray-800 text-sm">BIT Portal</div>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {NAV.map(item => (
                  <NavItem key={item.to} {...item} end={item.to === '/'} onClick={() => setMobileOpen(false)} />
                ))}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 px-6 py-4 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
