import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, FileText, Wrench, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/caretaker', label: 'Dashboard', icon: Home },
  { to: '/caretaker/complaints', label: 'Complaints', icon: FileText },
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
            ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary'
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

export default function CaretakerSidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeItem = NAV.find(item => (item.to === '/caretaker' ? location.pathname === '/caretaker' : location.pathname.startsWith(item.to)));
  const pageTitle = activeItem?.label || 'Caretaker Dashboard';

  return (
    <div className="min-h-screen bg-brand-surface font-sans">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-white border-r border-gray-200 shadow-sm lg:flex">
        <div className="flex h-[80px] items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">CTK</div>
            <div className="leading-tight">
              <div className="text-[14px] font-bold text-gray-900">Caretaker</div>
              <div className="text-[12px] font-semibold text-gray-600">Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 custom-scrollbar">
          {NAV.map(item => (
            <NavItem key={item.to + item.label} {...item} end={item.to === '/caretaker'} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-[250px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex h-[80px] items-center justify-between bg-brand-surface px-6 lg:px-8 pt-4 pb-2">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="font-semibold text-gray-800">{pageTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-[12px] border border-gray-100 bg-gray-50 px-4 py-2 hidden sm:block">
                <div className="text-[11px] text-gray-600">Caretaker</div>
                <div className="text-sm font-semibold text-gray-900">{user?.name || 'Caretaker'}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              exit={{ x: -250 }}
              className="fixed inset-y-0 left-0 z-50 w-[250px] flex-col bg-white shadow-lg lg:hidden"
            >
              <div className="flex h-[80px] items-center justify-between px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">CTK</div>
                  <div className="leading-tight">
                    <div className="text-[14px] font-bold text-gray-900">Caretaker</div>
                    <div className="text-[12px] font-semibold text-gray-600">Portal</div>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 space-y-0.5">
                {NAV.map(item => (
                  <NavItem
                    key={item.to + item.label}
                    {...item}
                    onClick={() => setMobileOpen(false)}
                    end={item.to === '/caretaker'}
                  />
                ))}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
