import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BedDouble,
  Bell,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/student', label: 'Dashboard', icon: LayoutGrid },
  { to: '/student/profile', label: 'Profile', icon: UserRound },
  { to: '/student/complaints', label: 'Complaints', icon: ClipboardList },
  { to: '/student/notices', label: 'Notices', icon: Bell },
];

function getInitials(name) {
  return (name || 'Student')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export default function StudentSidebar({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = NAV.find(item => (
    item.to === '/student' ? location.pathname === '/student' : location.pathname.startsWith(item.to)
  ));
  const pageTitle = activeItem?.label || 'Student Portal';
  const initials = getInitials(user?.name);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarNav = ({ mobile = false }) => (
    <div className={`flex h-full flex-col ${mobile ? 'px-4 py-5' : 'px-3 py-6'}`}>
      <div className={`flex ${mobile ? 'items-center justify-between px-2' : 'justify-center'} pb-6`}>
        <div
          title="Hostel Portal"
          className="relative flex h-14 w-14 items-center justify-center rounded-[24px] border border-brand-border/80 bg-white shadow-[0_18px_40px_rgba(125,83,246,0.14)]"
        >
          <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(159,116,247,0.18),transparent_60%)]" />
          <BedDouble className="relative h-6 w-6 text-brand-primary" strokeWidth={1.8} />
        </div>
        {mobile ? (
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-white text-brand-muted"
          >
            <X className="h-5 w-5" strokeWidth={1.8} />
          </button>
        ) : null}
      </div>

      {mobile ? (
        <div className="mb-6 rounded-[28px] border border-brand-border/70 bg-white/90 p-4 shadow-card">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">Hostel Portal</div>
          <div className="mt-2 font-display text-lg font-bold text-brand-text">Student Services</div>
          <div className="mt-1 text-sm leading-relaxed text-brand-muted">Complaints, notices, profile, and resident support in one place.</div>
        </div>
      ) : null}

      <nav className="flex flex-1 flex-col items-center gap-4">
        {NAV.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student'}
              onClick={() => setMobileOpen(false)}
              title={item.label}
              className={({ isActive }) => (
                `group relative flex items-center justify-center transition-all duration-200 ${
                  mobile ? 'w-full justify-start gap-3 rounded-[22px] px-4 py-3' : 'h-14 w-14 rounded-[22px]'
                } ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,#7D53F6_0%,#9F74F7_100%)] text-white shadow-[0_22px_40px_rgba(125,83,246,0.24)]'
                    : 'bg-white/70 text-brand-muted hover:-translate-y-0.5 hover:bg-white hover:text-brand-primary hover:shadow-[0_12px_30px_rgba(125,83,246,0.12)]'
                }`
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.9} />
                  {mobile ? (
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-semibold">{item.label}</span>
                      {isActive ? <span className="h-2 w-2 rounded-full bg-white/90" /> : null}
                    </div>
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={`pt-6 ${mobile ? '' : 'flex justify-center'}`}>
        <button
          onClick={handleLogout}
          title="Logout"
          className={`group flex items-center text-brand-muted transition-all duration-200 hover:text-brand-red ${
            mobile
              ? 'w-full gap-3 rounded-[22px] border border-brand-border/70 bg-white px-4 py-3 shadow-sm hover:border-red-200 hover:bg-red-50'
              : 'h-14 w-14 justify-center rounded-[22px] border border-brand-border/70 bg-white shadow-sm hover:border-red-200 hover:bg-red-50'
          }`}
        >
          <LogOut className="h-5 w-5" strokeWidth={1.9} />
          {mobile ? <span className="text-sm font-semibold">Logout</span> : null}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(159,116,247,0.16),transparent_20%),radial-gradient(circle_at_right,rgba(3,136,252,0.07),transparent_18%),linear-gradient(180deg,#f5f6fd_0%,#eef1f9_100%)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[104px] px-5 py-6 lg:block">
        <div className="flex h-full flex-col rounded-[34px] border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_24px_60px_rgba(145,158,171,0.18)]">
          <SidebarNav />
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="fixed inset-y-0 left-0 z-50 w-[288px] p-4 lg:hidden"
            >
              <div className="h-full rounded-[32px] border border-white/70 bg-[#F7F8FD]/95 backdrop-blur-xl shadow-[0_24px_60px_rgba(145,158,171,0.24)]">
                <SidebarNav mobile />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="min-w-0 lg:pl-[124px]">
        <header className="sticky top-0 z-30 px-4 pb-2 pt-4 md:px-6 lg:px-8 lg:pt-6">
          <div className="mx-auto max-w-[1440px] rounded-[30px] border border-white/80 bg-white/82 px-4 py-4 shadow-[0_24px_60px_rgba(145,158,171,0.14)] backdrop-blur-xl md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-border/80 bg-[#F6F7FD] text-brand-primary shadow-sm lg:hidden"
                >
                  <Menu className="h-5 w-5" strokeWidth={1.9} />
                </button>
                <div className="min-w-0">
                  <div className="truncate font-display text-[1.55rem] font-bold text-brand-text md:text-[1.7rem]">Hostel Portal</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-muted">{pageTitle}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-[24px] border border-brand-border/70 bg-[#FCFCFF] px-6 py-3 shadow-sm sm:block">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-muted">
                    {user?.email || 'student@portal.edu'}
                  </div>
                  <div className="mt-1 text-lg font-bold text-brand-text">{user?.name || 'Student Resident'}</div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#7D53F6_0%,#9F74F7_100%)] text-lg font-bold text-white shadow-[0_18px_36px_rgba(125,83,246,0.24)]">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-6 pt-2 md:px-6 md:pb-8 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
