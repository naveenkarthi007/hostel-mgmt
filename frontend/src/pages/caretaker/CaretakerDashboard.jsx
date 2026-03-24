import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { caretakerAPI } from '../../services/api';
import { Spinner, Badge } from '../../components/ui';
import { AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = {
  primarybg: '#EEF1F9',
  secondarybg: '#FFFFFF',
  primary: '#7D53F6',
  primarytext: '#000000',
  secondarytext: '#5F6388',
  pending: '#F0B041',
  orange: '#EA8C55',
  green: '#008000',
};

export default function CaretakerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caretakerAPI.getStats()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" className="text-orange-500" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentComplaints = data?.recentComplaints || [];

  return (
    <div className="space-y-3">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg p-3 md:p-4 bg-white border border-gray-50 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#7D53F6]/10 flex items-center justify-center text-[#7D53F6]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Complaint Management Dashboard</h1>
            <p className="text-xs text-gray-600 mt-0.5">Manage and resolve all hostel complaints from here</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: stats.totalStudents || 0, color: 'bg-white' },
          { label: 'Total Rooms', value: stats.totalRooms || 0, color: 'bg-white' },
          { label: 'Occupied Rooms', value: stats.occupiedRooms || 0, color: 'bg-white' },
          { label: 'Pending Issues', value: stats.pendingComplaints || 0, color: 'bg-white' },
        ].map(({ label, value, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`${color} rounded-lg p-3 border border-gray-50 shadow-sm`}
          >
            <div className="text-lg font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-600 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-1 rounded-lg p-4 bg-white border border-gray-100 shadow-sm"
        >
          <h2 className="text-base font-bold text-gray-900 mb-2">Complaint Status</h2>
          <div className="space-y-2">
            {[
              { label: 'Pending', value: stats.pendingComplaints, color: COLORS.pending, icon: AlertCircle },
              { label: 'In Progress', value: stats.inProgressComplaints, color: '#0388FC', icon: Clock },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-900">{label}</div>
                  <div className="text-lg font-bold text-gray-900">{value || 0}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 rounded-lg p-4 bg-white border border-gray-100 shadow-sm"
        >
          <h2 className="text-base font-bold text-gray-900 mb-2">Recent Complaints</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentComplaints.length > 0 ? (
              recentComplaints.map((complaint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#7D53F6]/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs text-gray-900 truncate">{complaint.title}</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {complaint.student_name || 'Unknown Student'} • Room {complaint.room_number || 'N/A'}
                      </p>
                    </div>
                    <Badge style={{
                      backgroundColor: complaint.status === 'pending' ? COLORS.pending :
                                      complaint.status === 'in_progress' ? '#0388FC' :
                                      COLORS.green,
                      color: 'white',
                    }}>
                      {complaint.status === 'pending' ? '⏳ Pending' :
                       complaint.status === 'in_progress' ? '🔧 In Progress' :
                       '✓ Resolved'}
                    </Badge>
                  </div>
                  {complaint.description && (
                    <p className="text-xs text-gray-600 line-clamp-1 mb-1">{complaint.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{complaint.priority?.toUpperCase() || 'MEDIUM'} Priority</span>
                    <span>{format(new Date(complaint.created_at), 'dd MMM yyyy')}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-green-400" />
                <p className="text-xs font-semibold text-gray-900">No complaints</p>
                <p className="text-xs text-gray-600">All complaints are resolved!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
