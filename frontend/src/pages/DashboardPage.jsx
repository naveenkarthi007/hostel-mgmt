import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { Spinner } from '../components/ui';
import { Building2, Home, Users, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PIE_COLORS = ['#fb7185', '#a78bfa', '#818cf8', '#38bdf8'];

function StatCard({ title, count, icon: Icon }) {
  const bgClass = 'bg-[#7D53F6]/10 text-[#7D53F6]';
  return (
    <div className={"bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md border border-gray-50/50"}>
      <div className={"h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 " + bgClass}>
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div>
        <div className="text-[13px] font-bold text-gray-800 leading-tight">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{count || 0} Total</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getStats()
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};
  const blockStats = data?.blockStats || [];

  // Generate pie data from the backend's blockStats
  const pieData = blockStats.length > 0 
    ? blockStats.map((b) => ({
        name: `Block ${b.block}`,
        value: Number(b.occupied) || 0
      }))
    : [{ name: 'No Data', value: 1 }];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-[#7D53F6]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl px-8 py-6 shadow-sm border border-gray-50 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-[22px] font-bold text-[#7D53F6] mb-2">
            Welcome {user?.name || 'Administrator'}! 👋
          </h1>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            You can manage all things in the Administrator Portal like Campus overview, Hostel occupancy, Student stats and Complaints.
          </p>
        </div>
        {/* User context information removed as requested */}
      </div>

      {/* Grid: Stats and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: 6 Stat Cards using Backend Data */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Students" count={stats.totalStudents} icon={Users} />
          <StatCard title="Total Rooms" count={stats.totalRooms} icon={Building2} />
          <StatCard title="Available Rooms" count={stats.availableRooms} icon={Home} />
          <StatCard title="Occupied Rooms" count={stats.occupiedRooms} icon={Home} />
          <StatCard title="Pending Complaints" count={stats.pendingComplaints} icon={Clock} />
          <StatCard title="Resolved Complaints" count={stats.resolvedComplaints} icon={CheckCircle} />
        </div>

        {/* Right Side: Pie Chart Card using Backend Data */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-50 p-6 flex flex-col">
          <h2 className="text-[14px] font-bold text-gray-800 mb-6">Occupancy by Block</h2>
          <div className="flex justify-center gap-4 text-[10px] text-gray-500 mb-2 font-medium flex-wrap">
            {pieData.map((d, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                {d.name}
              </div>
            ))}
          </div>
          <div className="flex-1 min-h-[220px] relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={0}
                  outerRadius={95}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={"cell-" + index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
