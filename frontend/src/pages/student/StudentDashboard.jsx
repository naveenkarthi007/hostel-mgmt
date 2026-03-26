import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { studentPortalAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, Spinner, EmptyState, Button } from '../../components/ui';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const COLORS = {
  primarybg: '#EEF1F9',
  secondarybg: '#FFFFFF',
  primary: '#7D53F6',
  primarydull: '#9F74F7',
  green: '#008000',
  pending: '#F0B041',
  red: '#DC2626',
  primarytext: '#000000',
  secondarytext: '#5F6388',
  skyblue: '#0388FC',
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
    case 'in_progress': return <Clock className="w-4 h-4" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'resolved': return 'bg-green-50 text-green-700';
    case 'in_progress': return 'bg-blue-50 text-blue-700';
    case 'pending': return 'bg-amber-50 text-amber-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentPortalAPI.getDashboard()
      .then(r => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-brand-primary" />
      </div>
    );
  }

  const { student, roommates, complaintStats, recentNotices } = data;

  return (
    <div
      className="min-h-screen p-3 md:p-4"
      style={{
        background: `linear-gradient(180deg, ${COLORS.primarybg} 0%, #F7F8FC 100%)`,
        color: COLORS.primarytext,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-[20px] p-4 md:p-5 border shadow-sm overflow-hidden relative"
          style={{
            backgroundColor: COLORS.secondarybg,
            borderColor: '#D8DCF0',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-50" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[1px]"
                  style={{ color: COLORS.skyblue }}
                >
                  Student Portal
                </p>
                <h1
                  className="text-2xl md:text-2xl font-bold mt-1"
                  style={{ color: COLORS.primary }}
                >
                  Welcome back, {user?.name || 'Resident'}.
                </h1>
                <p className="text-xs mt-1" style={{ color: COLORS.secondarytext }}>
                  Your hostel dashboard with room details, complaints, and latest notices at a glance.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link to="/student/complaints">
                    <Button className="px-3 py-1 text-xs" style={{ backgroundColor: COLORS.primary, color: COLORS.secondarybg }}>
                      File Complaint
                    </Button>
                  </Link>
                  <Link to="/student/profile">
                    <Button variant="outline" className="px-3 py-1 text-xs" style={{ borderColor: '#D8DCF0' }}>
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="rounded-xl p-3 border" style={{ backgroundColor: COLORS.primarybg, borderColor: '#D8DCF0' }}>
                <div className="text-xs uppercase tracking-wide font-bold mb-1" style={{ color: COLORS.secondarytext }}>
                  Room Status
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: COLORS.primary }}>
                  {student?.room_number || 'Pending'}
                </div>
                {student?.room_number && (
                  <div className="text-xs" style={{ color: COLORS.secondarytext }}>
                    Block {student.block} • Floor {student.floor}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: complaintStats?.total || 0, color: COLORS.primary },
            { label: 'Pending', value: complaintStats?.pending || 0, color: COLORS.pending },
            { label: 'In Progress', value: complaintStats?.in_progress || 0, color: COLORS.skyblue },
            { label: 'Resolved', value: complaintStats?.resolved || 0, color: COLORS.green },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg p-3 border shadow-sm"
              style={{
                backgroundColor: COLORS.secondarybg,
                borderColor: '#D8DCF0',
              }}
            >
              <div className="text-xs uppercase tracking-wide font-bold mb-1" style={{ color: COLORS.secondarytext }}>
                {label}
              </div>
              <div className="text-xl font-bold" style={{ color }}>
                {value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Room Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="lg:col-span-2 rounded-[20px] p-4 md:p-5 border shadow-sm"
            style={{
              backgroundColor: COLORS.secondarybg,
              borderColor: '#D8DCF0',
            }}
          >
            <h2 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>
              Room Information
            </h2>
            <p className="text-xs mb-3" style={{ color: COLORS.secondarytext }}>
              Current room assignment and roommates
            </p>

            {student?.room_number ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div
                    className="rounded-lg p-3 border"
                    style={{ backgroundColor: COLORS.primarybg, borderColor: '#D8DCF0' }}
                  >
                    <div className="text-xs uppercase tracking-wide font-bold mb-1" style={{ color: COLORS.secondarytext }}>
                      Room
                    </div>
                    <div className="text-xl font-bold" style={{ color: COLORS.primary }}>
                      {student.room_number}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3 border"
                    style={{ backgroundColor: COLORS.primarybg, borderColor: '#D8DCF0' }}
                  >
                    <div className="text-xs uppercase tracking-wide font-bold mb-1" style={{ color: COLORS.secondarytext }}>
                      Block
                    </div>
                    <div className="text-xl font-bold" style={{ color: COLORS.primary }}>
                      {student.block}
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3 border"
                    style={{ backgroundColor: COLORS.primarybg, borderColor: '#D8DCF0' }}
                  >
                    <div className="text-xs uppercase tracking-wide font-bold mb-1" style={{ color: COLORS.secondarytext }}>
                      Floor
                    </div>
                    <div className="text-xl font-bold" style={{ color: COLORS.primary }}>
                      {student.floor}
                    </div>
                  </div>
                </div>

                {roommates.length > 0 && (
                  <div className="border-t pt-3" style={{ borderColor: '#D8DCF0' }}>
                    <h3 className="font-semibold text-sm mb-2" style={{ color: COLORS.primary }}>
                      {roommates.length} {roommates.length === 1 ? 'Roommate' : 'Roommates'}
                    </h3>
                    <div className="space-y-2">
                      {roommates.map((roommate, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ backgroundColor: COLORS.primarybg }}
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: COLORS.primary }}
                          >
                            {roommate.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs">{roommate.name}</div>
                            <div className="text-xs" style={{ color: COLORS.secondarytext }}>
                              {roommate.department} • Year {roommate.year}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-1 text-amber-400" />
                <p className="font-semibold text-sm mb-1">No Room Allocated</p>
                <p className="text-xs" style={{ color: COLORS.secondarytext }}>
                  Contact hostel admin for room assignment.
                </p>
              </div>
            )}
          </motion.div>

          {/* Recent Complaints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-[20px] p-4 md:p-5 border shadow-sm"
            style={{
              backgroundColor: COLORS.secondarybg,
              borderColor: '#D8DCF0',
            }}
          >
            <h2 className="text-lg font-bold mb-1" style={{ color: COLORS.primary }}>
              Activity Summary
            </h2>
            <p className="text-xs mb-3" style={{ color: COLORS.secondarytext }}>
              Complaint status breakdown
            </p>

            <div className="space-y-2">
              {complaintStats?.total === 0 ? (
                <div className="py-4 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-green-400" />
                  <p className="text-xs font-semibold">All Set!</p>
                  <p className="text-xs" style={{ color: COLORS.secondarytext }}>
                    No pending complaints
                  </p>
                </div>
              ) : (
                [
                  { label: 'Pending', value: complaintStats?.pending, color: COLORS.pending },
                  { label: 'In Progress', value: complaintStats?.in_progress, color: COLORS.skyblue },
                  { label: 'Resolved', value: complaintStats?.resolved, color: COLORS.green },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{label}</span>
                      <span className="text-xs font-bold" style={{ color }}>{value || 0}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${complaintStats?.total ? (value / complaintStats.total) * 100 : 0}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to="/student/complaints" className="w-full mt-3">
              <Button className="w-full text-xs" style={{ backgroundColor: COLORS.primary, color: COLORS.secondarybg }}>
                View All Complaints
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-[20px] p-4 md:p-5 border shadow-sm"
          style={{
            backgroundColor: COLORS.secondarybg,
            borderColor: '#D8DCF0',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: COLORS.primary }}>
                Recent Notices
              </h2>
              <p className="text-xs" style={{ color: COLORS.secondarytext }}>
                Latest updates from hostel administration
              </p>
            </div>
            <Link to="/student/notices" className="text-xs font-semibold" style={{ color: COLORS.primary }}>
              View All →
            </Link>
          </div>

          {recentNotices.length > 0 ? (
            <div className="space-y-2">
              {recentNotices.map((notice, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg border hover:shadow-sm transition-all"
                  style={{ backgroundColor: COLORS.primarybg, borderColor: '#D8DCF0' }}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-xs text-black truncate">{notice.title}</h3>
                        {notice.category === 'urgent' && (
                          <Badge style={{ backgroundColor: COLORS.red, color: 'white' }}>
                            {notice.category}
                          </Badge>
                        )}
                      </div>
                      {notice.content && (
                        <p className="text-xs line-clamp-2" style={{ color: COLORS.secondarytext }}>
                          {notice.content}
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        {format(new Date(notice.created_at), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-1" style={{ color: COLORS.primary }} />
              <p className="text-xs font-semibold">No notices yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
