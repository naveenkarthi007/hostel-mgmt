import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { studentPortalAPI } from '../../services/api';
import { Card, Badge, Spinner, PageHeader } from '../../components/ui';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    studentPortalAPI.getProfile()
      .then(r => setProfile(r.data.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" className="text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 text-center border border-gray-100"
        >
          <h2 className="font-display text-xl font-bold text-brand-text mb-2">Profile Not Linked</h2>
          <p className="text-sm text-brand-muted mb-4">{error}</p>
          <div className="bg-blue-50 rounded-xl p-4 text-left text-xs text-brand-skyblue">
            <p className="font-semibold mb-1">How to fix this:</p>
            <p>Contact the hostel warden or admin to link your email address to your student record.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const fields = [
    { label: 'Register No.', value: profile.register_no },
    { label: 'Department', value: profile.department },
    { label: 'Year', value: `Year ${profile.year}` },
    { label: 'Phone', value: profile.phone || 'N/A' },
    { label: 'Email', value: profile.email || 'N/A' },
    { label: 'Room', value: profile.room_number ? `${profile.room_number} (Block ${profile.block})` : 'Not Allocated' },
    { label: 'Room Type', value: profile.room_type ? profile.room_type.charAt(0).toUpperCase() + profile.room_type.slice(1) : 'N/A' },
  ];

  const feeVariant = profile.fee_status === 'paid' ? 'success' : profile.fee_status === 'partial' ? 'warning' : 'danger';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Student Identity Record"
        title="My Profile"
        description="Review your registered hostel profile, room assignment, and fee status information as maintained by the administration."
      />

      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-display font-black text-2xl border border-white/30">
              {profile.name[0]}
            </div>
            <div>
              <h2 className="text-white font-display text-2xl font-bold">{profile.name}</h2>
              <p className="text-white/60 text-sm">{profile.register_no}, {profile.department}</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-brand-text">Fee Status:</span>
            <Badge variant={feeVariant} className="capitalize">{profile.fee_status}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-brand-bg rounded-xl px-4 py-3"
              >
                <div className="text-xs text-brand-muted font-semibold uppercase tracking-wide">{field.label}</div>
                <div className="text-sm font-medium text-brand-text mt-1">{field.value}</div>
              </motion.div>
            ))}
          </div>

          {profile.address && (
            <div className="mt-4 bg-brand-bg rounded-xl px-4 py-3">
              <div className="text-xs text-brand-muted font-semibold uppercase tracking-wide mb-1">Address</div>
              <p className="text-sm text-brand-text">{profile.address}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
