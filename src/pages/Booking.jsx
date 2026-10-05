import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { fetchCourses, fetchInstructors, fetchSlots, createBooking } from '../services/api';

export default function Booking({ setToast }) {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    course_id: 'practical-code-8',
    instructor_id: 'inst-1',
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cData, iData] = await Promise.all([fetchCourses(), fetchInstructors()]);
        setCourses(cData);
        setInstructors(iData);
        if (cData.length > 0) {
          setFormData(prev => ({ ...prev, course_id: cData[0].id }));
        }
      } catch (err) {
        console.error('Failed to load booking dependencies:', err);
      }
    }
    loadInitialData();
  }, []);

  // Fetch live slots whenever preferred_date changes
  useEffect(() => {
    async function loadDateSlots() {
      if (!formData.preferred_date) return;
      setLoadingSlots(true);
      try {
        const data = await fetchSlots(formData.preferred_date);
        setSlots(data);
        // Default select first available slot
        const firstAvail = data.find(s => typeof s === 'object' ? s.isAvailable : true);
        if (firstAvail) {
          setFormData(prev => ({ ...prev, preferred_time: typeof firstAvail === 'object' ? firstAvail.time : firstAvail }));
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadDateSlots();
  }, [formData.preferred_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.preferred_time) {
      setToast({ type: 'error', message: 'Please select an available time slot.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking(formData);
      setConfirmation(res.data);
      setToast({ type: 'success', message: 'Booking confirmed successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Live Slot Scheduling
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Book Your Driving Lesson
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Select your course, pick a certified instructor, and lock in your date and time in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Booking Guidelines & Benefits */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              How Booking Works
            </h3>
            <ol className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <span className="font-semibold text-white block">Choose Your Package</span>
                  <span>Select from theory, practical, defensive, or refresher driving tiers.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <span className="font-semibold text-white block">Select Date & Time</span>
                  <span>Our calendar checks live availability to prevent double-booking.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <span className="font-semibold text-white block">Get Instant Confirmation</span>
                  <span>Receive a unique booking reference code to present at your lesson.</span>
                </div>
              </li>
            </ol>
          </div>

          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertCircle className="w-4 h-4" />
              <span>Rescheduling Policy</span>
            </div>
            <p>
              Free cancellation and rescheduling up to 12 hours before your scheduled lesson slot.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Booking Form */}
        <div className="lg:col-span-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Course & Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Driving Course *</label>
                  <select
                    required
                    value={formData.course_id}
                    onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (${c.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Instructor Preference</label>
                  <select
                    value={formData.instructor_id}
                    onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Any Instructor">Any Available Instructor</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Date & Slot Picker */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <label className="text-xs font-semibold text-slate-300">Preferred Lesson Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select 1-Hour Time Slot *</label>
                  {loadingSlots ? (
                    <p className="text-xs text-slate-400 italic">Checking slot availability...</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {slots.map((slotObj, idx) => {
                        const slotTime = typeof slotObj === 'object' ? slotObj.time : slotObj;
                        const isAvail = typeof slotObj === 'object' ? slotObj.isAvailable : true;
                        const isSelected = formData.preferred_time === slotTime;

                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={!isAvail}
                            onClick={() => isAvail && setFormData({ ...formData, preferred_time: slotTime })}
                            className={`p-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md'
                                : isAvail
                                ? 'bg-slate-900 text-slate-200 border-slate-800 hover:border-amber-500/50'
                                : 'bg-slate-950 text-slate-600 border-slate-900 line-through cursor-not-allowed'
                            }`}
                          >
                            {slotTime}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Contact Info */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Student Contact Info</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Smith"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.student_email}
                      onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +263 70 000 0000"
                      value={formData.student_phone}
                      onChange={(e) => setFormData({ ...formData, student_phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl text-base font-extrabold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 transition-all"
              >
                {submitting ? 'Confirming Your Lesson...' : 'Confirm Appointment Reservation'}
              </button>

            </form>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full border border-amber-500/40 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Booking Confirmed!</span>
              <h3 className="text-2xl font-extrabold text-white">Lesson Ticket Created</h3>
              <p className="text-xs text-slate-300">
                Thank you, <strong className="text-white">{confirmation.student_name}</strong>. Your driving appointment has been recorded in our system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2 text-left text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Reference Code:</span>
                <span className="font-extrabold text-amber-400 font-mono text-sm">{confirmation.reference_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-white">{confirmation.preferred_date} ({confirmation.preferred_time})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">{confirmation.status}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmation(null)}
              className="w-full py-3 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-xs"
            >
              Done & Return to Site
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
