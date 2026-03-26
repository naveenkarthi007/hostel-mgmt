import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRedirect = (role) => {
    if (role === 'admin') navigate('/');
    else if (role === 'caretaker') navigate('/caretaker');
    else if (role === 'warden') navigate('/warden');
    else navigate('/student');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success('Welcome back!');
      handleRedirect(data.user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async credentialResponse => {
    setLoading(true);
    try {
      const data = await googleLogin(credentialResponse.credential);
      toast.success('Welcome! Signed in with Google.');
      handleRedirect(data.user.role);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-8">
      <div className="w-full max-w-[23rem]">
        <div className="w-full rounded-[18px] border border-brand-border/80 bg-white px-5 py-5 shadow-sm md:px-6 md:py-6">
          <div className="mb-5 text-center">
            <h1 className="font-display text-[1.5rem] font-bold tracking-tight text-brand-primary">BIT HOSTEL PORTAL</h1>
            <h1 className="font-display text-[1.5rem] font-bold tracking-tight text-brand-primary">Hi, Welcome Back!</h1>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-[0.95rem] font-medium text-black">Username</label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your username"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="h-11 w-full rounded-md border border-brand-border bg-[#EEF2FB] px-3.5 text-[0.95rem] text-brand-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-[0.95rem] font-medium text-black">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="h-11 w-full rounded-md border border-brand-border bg-[#EEF2FB] px-3.5 text-[0.95rem] text-brand-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                required
              />
            </div>
            <Button
              type="submit"
              size="md"
              loading={loading}
              className="mt-1 h-11 w-full justify-center rounded-md bg-gradient-to-r from-brand-primary to-brand-primary-light text-[0.95rem] text-white shadow-none hover:translate-y-0"
            >
              Login
            </Button>
          </form>

          <div className="my-4 text-center text-[0.95rem] text-black">
            <span>Or</span>
          </div>

          <div className="flex justify-center">
            <div className="overflow-hidden rounded-md border border-brand-border bg-white">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="medium"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
