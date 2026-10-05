import React, { useState } from 'react';
import { Lock, UserCheck, Calendar, Mail, Star, LogOut, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { adminLogin, fetchAdminDashboard } from '../services/api';

export default function Admin({ setToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard Data
  const [dashData, setDashData] = useState({ bookings: [], messages: [], stats: { totalBookings: 0, totalMessages: 0, totalReviews: 0, avgRating: 5.0 } });
  const [loadingDash, setLoadingDash] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await adminLogin(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      setToast({ type: 'success', message: 'Welcome back, Driving School Administrator!' });
      loadDashboard();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoggingIn(false);
    }
  };

  async function loadDashboard() {
    setLoadingDash(true);
    try {
      const data = await fetchAdminDashboard();
      setDashData(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoadingDash(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Management Portal</h2>
            <p className="text-xs text-slate-400">Log in to view bookings, review inquiries, and monitor performance.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
              <span>Default Local Dev Credentials: </span>
              <span className="font-mono text-amber-400 font-bold">admin</span> / <span className="font-mono text-amber-400 font-bold">admin123</span>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-xs shadow-lg shadow-amber-500/20"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Driving School Executive Dashboard</h1>
            <p className="text-xs text-slate-400">Real-time booking management & inquiry moderation</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboard}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingDash ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{dashData.stats.totalBookings}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Contact Messages</span>
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{dashData.stats.totalMessages}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Verified Reviews</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{dashData.stats.totalReviews}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Average Score</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400">{dashData.stats.avgRating} / 5.0</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Recent Student Bookings ({dashData.bookings.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Ref Code</th>
                <th className="p-3">Student</th>
                <th className="p-3">Contact Phone</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Date & Slot</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dashData.bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-extrabold text-amber-400">{b.reference_code}</td>
                  <td className="p-3 font-bold text-white">{b.student_name}</td>
                  <td className="p-3 text-slate-300">{b.student_phone}</td>
                  <td className="p-3">{b.course_title || b.course_id}</td>
                  <td className="p-3">{b.preferred_date} <br/><span className="text-[10px] text-slate-400">{b.preferred_time}</span></td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Messages Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-amber-400" />
          Contact Form Submissions Inbox ({dashData.messages.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Sender</th>
                <th className="p-3">Email</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message Snippet</th>
                <th className="p-3">Received At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dashData.messages.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-white">{m.name}</td>
                  <td className="p-3 text-slate-300">{m.email}</td>
                  <td className="p-3 font-semibold text-amber-400">{m.subject}</td>
                  <td className="p-3 max-w-xs truncate text-slate-400">{m.message}</td>
                  <td className="p-3 text-[10px] text-slate-500">{new Date(m.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
