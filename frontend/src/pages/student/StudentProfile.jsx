import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { studentPortalAPI } from '../../services/api';
import { Spinner } from '../../components/ui';
import { AlertCircle, Mail, Phone, MapPin, Building2, BookOpen, Calendar } from 'lucide-react';

const COLORS = {
  primarybg: '#EEF1F9',
  secondarybg: '#FFFFFF',
  primary: '#7D53F6',
  primarytext: '#000000',
  secondarytext: '#5F6388',
  skyblue: '#0388FC',
  green: '#008000',
  pending: '#F0B041',
  red: '#DC2626',
};

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
          className="max-w-md w-full bg-white rounded-lg shadow-card p-5 text-center border border-gray-100"
        >
          <AlertCircle className="w-8 h-8 mx-auto mb-1 text-red-400" />
          <h2 className="font-display text-lg font-bold text-brand-text mb-1">Profile Not Linked</h2>
          <p className="text-xs text-brand-muted mb-3">{error}</p>
          <div className="bg-blue-50 rounded-lg p-3 text-left text-xs text-brand-skyblue">
            <p className="font-semibold mb-1">How to fix this:</p>
            <p>Contact the hostel warden or admin to link your email address to your student record.</p>
          </div>
        </motion.div>
      </div>
    );
  }


  const fields = [
    { icon: <BookOpen className="w-4 h-4" />, label: 'Register No.', value: profile.register_no },
    { icon: <Building2 className="w-4 h-4" />, label: 'Department', value: profile.department },
    { icon: <Calendar className="w-4 h-4" />, label: 'Year', value: `Year ${profile.year}` },
    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: profile.phone || 'N/A' },
    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: profile.email || 'N/A' },
    { icon: <Building2 className="w-4 h-4" />, label: 'Room', value: profile.room_number ? `${profile.room_number} (Block ${profile.block})` : 'Not Allocated' },
  ];

  return (
    <div
      className="min-h-screen p-3 md:p-4"
      style={{
        background: `linear-gradient(180deg, ${COLORS.primarybg} 0%, #F7F8FC 100%)`,
        color: COLORS.primarytext,
      }}
    >
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Header Banner with Profile */}
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
            <p className="text-xs font-semibold uppercase tracking-[1px]" style={{ color: COLORS.skyblue }}>
              Student Profile
            </p>
            <h1 className="text-2xl md:text-2xl font-bold mt-1 mb-3" style={{ color: COLORS.primary }}>
              My Student Profile
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary} 0%, #9F74F7 100%)`,
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
              </motion.div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-lg md:text-xl font-bold" style={{ color: COLORS.primary }}>
                  {profile.name}
                </h2>
                <p className="text-xs mt-1" style={{ color: COLORS.secondarytext }}>
                  {profile.register_no} • {profile.department}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-[20px] p-4 md:p-5 border shadow-sm"
          style={{
            backgroundColor: COLORS.secondarybg,
            borderColor: '#D8DCF0',
          }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.primary }}>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fields.map((field, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: COLORS.primarybg,
                  borderColor: '#D8DCF0',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div style={{ color: COLORS.primary }}>{field.icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5px]" style={{ color: COLORS.secondarytext }}>
                    {field.label}
                  </div>
                </div>
                <div className="text-xs font-semibold" style={{ color: COLORS.primarytext }}>
                  {field.value}
                </div>
              </motion.div>
            ))}

            {profile.address && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fields.length * 0.05 }}
                className="rounded-lg p-3 border lg:col-span-3 md:col-span-2"
                style={{
                  backgroundColor: COLORS.primarybg,
                  borderColor: '#D8DCF0',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3 h-3" style={{ color: COLORS.primary }} />
                  <div className="text-[10px] font-bold uppercase tracking-[0.5px]" style={{ color: COLORS.secondarytext }}>
                    Address
                  </div>
                </div>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: COLORS.primarytext }}>
                  {profile.address}
                </p>
              </motion.div>
            )}

            {profile.room_type && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (fields.length + 1) * 0.05 }}
                className="rounded-lg p-3 border"
                style={{
                  backgroundColor: COLORS.primarybg,
                  borderColor: '#D8DCF0',
                }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color: COLORS.secondarytext }}>
                  Room Type
                </div>
                <div className="text-xs font-semibold" style={{ color: COLORS.primarytext }}>
                  {profile.room_type.charAt(0).toUpperCase() + profile.room_type.slice(1)}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Room Details Card */}
        {profile.room_number && (
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
            <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.primary }}>
              Room Assignment
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Room Number', value: profile.room_number, icon: '🚪' },
                { label: 'Block', value: profile.block, icon: '🏢' },
                { label: 'Floor', value: profile.floor, icon: '📍' },
                { label: 'Status', value: 'Assigned', icon: '✓' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-lg p-3 text-center border"
                  style={{
                    backgroundColor: COLORS.primarybg,
                    borderColor: '#D8DCF0',
                  }}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color: COLORS.secondarytext }}>
                    {item.label}
                  </div>
                  <div className="text-xs font-bold" style={{ color: COLORS.primary }}>
                    {item.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Status Summary */}
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
          <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.primary }}>
            Account Status
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Account Status', value: 'Active', color: COLORS.green },
              { label: 'Room Allocation', value: profile.room_number ? 'Assigned' : 'Pending', color: profile.room_number ? COLORS.green : COLORS.pending },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg p-3"
                style={{ backgroundColor: COLORS.primarybg }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.5px] mb-1" style={{ color: COLORS.secondarytext }}>
                  {item.label}
                </div>
                <div className="text-xs font-bold" style={{ color: item.color }}>
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
