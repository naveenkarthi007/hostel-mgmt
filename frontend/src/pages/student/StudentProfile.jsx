import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { studentPortalAPI } from '../../services/api';
import { Spinner } from '../../components/ui';
import { AlertCircle, Mail, Phone, MapPin, Building2, BookOpen, Calendar, CheckCircle2, BedDouble, ShieldCheck } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-card p-6 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Not Linked</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="bg-blue-50/50 rounded-xl p-4 text-left border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-1">How to fix this:</p>
            <p className="text-sm text-blue-700">Contact the hostel warden or administrator to link your registered email address to your student record.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const parseRoomStatus = () => {
    if (!profile.room_number) return { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', text: 'Pending Allocation' };
    return { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'Assigned' };
  };

  const roomState = parseRoomStatus();

  return (
    <div className="pb-12 bg-slate-50 min-h-screen pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-6">

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-xl border-4 border-white flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-primary-light"
            >
              {profile.name.charAt(0).toUpperCase()}
            </motion.div>

            <div className="flex-1 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-wide uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Student
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                {profile.name}
              </h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gray-400" /> {profile.register_no}
                </div>
                <div className="hidden sm:block text-gray-300">•</div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-gray-400" /> {profile.department}
                </div>
              </div>
            </div>

            <div className="md:self-end pt-4 md:pt-0">
              <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${roomState.bg} ${roomState.border} ${roomState.color} font-semibold text-sm shadow-sm`}>
                <CheckCircle2 className="w-5 h-5" />
                {roomState.text}
              </div>
            </div>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

            {/* Left Column: Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen, label: 'Register No.', value: profile.register_no, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { icon: Building2, label: 'Department', value: profile.department, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { icon: Calendar, label: 'Academic Year', value: `Year ${profile.year}`, color: 'text-pink-600', bg: 'bg-pink-50' },
                    { icon: Phone, label: 'Contact Phone', value: profile.phone || 'N/A', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { icon: Mail, label: 'Email Address', value: profile.email || 'N/A', color: 'text-blue-600', bg: 'bg-blue-50' },
                  ].map((field, i) => (
                    <div key={i} className="group p-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 w-10 h-10 rounded-xl ${field.bg} ${field.color} flex items-center justify-center shrink-0`}>
                          <field.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{field.label}</p>
                          <p className="font-semibold text-gray-900">{field.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {profile.address && (
                    <div className="sm:col-span-2 group p-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Residential Address</p>
                          <p className="font-medium text-gray-800 leading-relaxed">{profile.address}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Room Assignment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Hostel Details</h3>
                </div>

                {profile.room_number ? (
                  <div className="space-y-4">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Room Number</p>
                      <p className="text-4xl font-black text-brand-primary tracking-tight">{profile.room_number}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Block</p>
                        <p className="text-xl font-bold text-gray-800">{profile.block}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Floor</p>
                        <p className="text-xl font-bold text-gray-800">{profile.floor}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 mt-4 flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500">Room Type</p>
                      <p className="text-sm font-bold text-gray-900 capitalize px-3 py-1 bg-white rounded-lg shadow-sm border border-gray-200">
                        {profile.room_type}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <BedDouble className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">You have not been allocated a room yet.</p>
                    <p className="text-xs text-gray-400 mt-2">Please contact the hostel administration.</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
