import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Users, CheckSquare, List, Calendar, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/students', label: 'All Students', icon: Users },
  { to: '/rooms', label: 'Rooms Listing', icon: List },
  { to: '/allocations', label: 'Room Allocation', icon: CheckSquare },
  { to: '/outpasses', label: 'Outpass Approvals', icon: CheckSquare },
  { to: '/mess-menu', label: 'Mess Menu', icon: List },
  { to: '/visitors', label: 'Visitors', icon: Users },
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

export default function Sidebar({ children }) {
  const contentZoom = 0.72;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = 'Administrator Dashboard';
  const initials = user?.name?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="min-h-screen bg-brand-surface font-sans page-shell">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-white/70 bg-white/85 shadow-[0_24px_60px_rgba(145,158,171,0.16)] backdrop-blur-xl lg:flex">
        <div className="border-b border-brand-border/70 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-light text-sm font-black text-white shadow-lg">BIT</div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-gray-900">Bannari Amman</div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-muted">Admin Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1 custom-scrollbar">
          {NAV.map(item => (
            <NavItem key={item.to + item.label} {...item} end={item.to === '/'} />
          ))}
        </nav>

        <div className="border-t border-brand-border/70 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-medium text-gray-600 transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[272px]">
        <header className="sticky top-0 z-30 px-6 pb-2 pt-4 lg:px-8">
          <div className="glass-panel flex w-full items-center justify-between rounded-[28px] border border-white/70 px-6 py-4 shadow-[0_18px_44px_rgba(145,158,171,0.12)]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(open => !open)}
                className="rounded-xl bg-brand-primary/10 p-2 text-brand-primary lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-brand-muted">Administration Workspace</div>
                  <span className="font-semibold text-gray-800">{pageTitle}</span>
                </div>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-[18px] border border-[#ece8ff] bg-[#f8f6ff] px-4 py-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-brand-muted">Administrator</div>
                <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-light text-sm font-bold text-white shadow-md">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
            <div className="relative flex w-[272px] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-brand-border/70 px-6 py-5">
                <div className="font-bold text-gray-800 text-sm">BIT Admin Portal</div>
                <button onClick={() => setMobileOpen(false)} className="rounded-xl bg-gray-100 p-2 text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-6 py-5">
                <div className="rounded-[24px] border border-[#ece8ff] bg-[#f8f6ff] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brand-muted">Full access</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-5">
                {NAV.map(item => (
                  <NavItem key={item.to} {...item} end={item.to === '/'} onClick={() => setMobileOpen(false)} />
                ))}
              </div>
              <div className="border-t border-brand-border/70 p-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-medium text-gray-600 transition-colors hover:bg-brand-primary/10 hover:text-brand-primary"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 px-6 py-4 lg:px-8">
          <div style={{ zoom: contentZoom }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
