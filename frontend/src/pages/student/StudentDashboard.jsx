import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { studentPortalAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Badge, Spinner, EmptyState, SectionCard, Button } from '../../components/ui';
import { format } from 'date-fns';

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
    <div className="space-y-6 animate-fade-in">
      <section className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/86 px-6 py-7 shadow-[0_28px_72px_rgba(145,158,171,0.16)] backdrop-blur-xl md:px-8 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(159,116,247,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(3,136,252,0.10),transparent_24%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-brand-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-primary">
              Student Services Portal
            </div>
            <h1 className="mt-5 font-display text-4xl font-black tracking-tight text-brand-text md:text-[3.2rem] md:leading-[1.04]">
              Welcome back, {user?.name || 'Resident'}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted md:text-base">
              Review your room, track open service requests, and stay updated with hostel notices from a cleaner student dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/student/complaints">
                <Button className="px-5">Open Complaint Desk</Button>
              </Link>
              <Link to="/student/profile">
                <Button variant="outline" className="px-5">View Profile</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px]">
            <div className="rounded-[24px] border border-brand-border/70 bg-[linear-gradient(135deg,#7D53F6_0%,#9F74F7_100%)] p-5 text-white shadow-[0_18px_40px_rgba(125,83,246,0.20)]">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Room Status</div>
              <div className="mt-3 font-display text-3xl font-black">{student?.room_number || 'Pending'}</div>
              <div className="mt-2 text-sm text-white/80">
                {student?.room_number ? `Block ${student.block}, Floor ${student.floor}` : 'Allocation not assigned yet'}
              </div>
            </div>
            <div className="rounded-[24px] border border-brand-border/70 bg-white/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-muted">Live Queue</div>
              <div className="mt-3 font-display text-3xl font-black text-brand-text">{complaintStats?.pending || 0}</div>
              <div className="mt-2 text-sm text-brand-muted">Pending requests awaiting action</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['Total Complaints', complaintStats?.total || 0, 'text-brand-text'],
          ['Pending', complaintStats?.pending || 0, 'text-amber-600'],
          ['In Progress', complaintStats?.in_progress || 0, 'text-brand-skyblue'],
          ['Resolved', complaintStats?.resolved || 0, 'text-brand-green'],
        ].map(([label, value, color]) => (
          <Card key={label} className="p-5 text-center">
            <div className={`font-display text-2xl font-black ${color}`}>{value}</div>
            <div className="text-xs text-brand-muted mt-1">{label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Room Information" description="Current room, floor, and shared occupancy details.">
          {student?.room_number ? (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-brand-bg rounded-[22px] p-4 text-center">
                  <div className="font-display font-bold text-brand-text">{student.room_number}</div>
                  <div className="text-xs text-brand-muted">Room</div>
                </div>
                <div className="bg-brand-bg rounded-[22px] p-4 text-center">
                  <div className="font-display font-bold text-brand-text">Block {student.block}</div>
                  <div className="text-xs text-brand-muted">Floor {student.floor}</div>
                </div>
              </div>
              {roommates.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-muted mb-2">Roommates</div>
                  <div className="space-y-2">
                    {roommates.map((roommate, i) => (
                      <div key={i} className="flex items-center gap-3 bg-brand-bg rounded-lg px-3 py-2">
                        <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold">
                          {roommate.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-brand-text truncate">{roommate.name}</div>
                          <div className="text-xs text-brand-muted">{roommate.department}, Year {roommate.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState title="No room allocated yet" description="Contact hostel admin for room allocation." />
          )}
        </SectionCard>

        <SectionCard
          title="Recent Notices"
          description="Official updates from the hostel administration."
          action={<Link to="/student/notices" className="text-xs text-brand-primary font-semibold hover:underline">View All</Link>}
        >
          {recentNotices.length > 0 ? (
            <div className="divide-y divide-brand-border/70">
              {recentNotices.map((notice, i) => (
                <div key={i} className="px-1 py-3 hover:bg-brand-surface/35 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-brand-text">{notice.title}</span>
                    <Badge variant={notice.category === 'urgent' ? 'danger' : notice.category === 'events' ? 'primary' : 'default'}>
                      {notice.category}
                    </Badge>
                  </div>
                  {notice.content && <p className="text-xs text-brand-muted line-clamp-2">{notice.content}</p>}
                  <p className="text-xs text-gray-400 mt-1">{format(new Date(notice.created_at), 'dd MMM yyyy')}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No notices yet" />
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/student/complaints">
          <Card hover className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[18px] bg-amber-50 flex items-center justify-center text-xs font-semibold text-amber-700">CMP</div>
            <div>
              <div className="font-semibold text-brand-text">File a Complaint</div>
              <div className="text-xs text-brand-muted">Report maintenance issues</div>
            </div>
          </Card>
        </Link>
        <Link to="/student/profile">
          <Card hover className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-[18px] bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-700">PRO</div>
            <div>
              <div className="font-semibold text-brand-text">View Profile</div>
              <div className="text-xs text-brand-muted">Your hostel details</div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
