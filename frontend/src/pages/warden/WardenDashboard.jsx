import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { wardenAPI } from '../../services/api';
import { Spinner, Badge } from '../../components/ui';
import { Users, Home, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PIE_COLORS = ['#fb7185', '#a78bfa', '#818cf8', '#38bdf8'];

export default function WardenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wardenAPI.getStats()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const blockStats = data?.blockStats || [];
  const recentStudents = data?.recentStudents || [];

  const pieData = blockStats.length > 0
    ? blockStats.map((b) => ({ name: `Block ${b.block}`, value: Number(b.occupied) || 0 }))
    : [{ name: 'No Data', value: 1 }];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Warden Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Student oversight, room management, and hostel statistics</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats.totalStudents || 0, icon: Users, color: 'bg-blue-50' },
          { label: 'Total Rooms', value: stats.totalRooms || 0, icon: Home, color: 'bg-green-50' },
          { label: 'Available', value: stats.availableRooms || 0, icon: '📌', color: 'bg-amber-50' },
          { label: 'Occupied', value: stats.occupiedRooms || 0, icon: '✓', color: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`${color} rounded-2xl p-4 border border-gray-100 shadow-sm`}
          >
            <div className="text-2xl mb-2">
              {typeof Icon === 'string' ? Icon : <Icon className="w-6 h-6" />}
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-600 mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-1 rounded-2xl p-6 bg-white border border-gray-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Occupancy by Block</h2>
          {pieData.length > 0 && pieData[0].value > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              No occupancy data
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="lg:col-span-1 rounded-2xl p-6 bg-white border border-gray-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Room Statistics</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Capacity', value: blockStats.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0) },
              { label: 'Currently Occupied', value: blockStats.reduce((sum, b) => sum + (Number(b.occupied) || 0), 0) },
              { label: 'Available Slots', value: Math.max(0, (blockStats.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0) - blockStats.reduce((sum, b) => sum + (Number(b.occupied) || 0), 0))) },
            ].map(({ label, value }) => (
              <div key={label} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="text-sm text-gray-600 mb-1">{label}</div>
                <div className="text-2xl font-bold text-blue-600">{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Students */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Registered Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Register No', 'Department', 'Year', 'Date'].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase text-gray-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentStudents.length > 0 ? (
                recentStudents.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.register_no}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Year {student.year}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{format(new Date(student.created_at), 'dd MMM yyyy')}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No recent students
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
