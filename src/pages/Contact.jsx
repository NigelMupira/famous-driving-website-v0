import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { submitContact } from '../services/api';

export default function Contact({ setToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ type: 'error', message: 'Please complete all required fields.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitContact(formData);
      setToast({ type: 'success', message: res.message });
      setSubmittedSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Get In Touch
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Contact Famous Driving School
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Have questions about Class 4, Class 2, provisional theory, or combo packages? Reach out to our Harare team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Info & Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              Direct Channels
            </h3>

            <div className="space-y-4 text-sm">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Physical Location</h4>
                  <p className="text-xs text-slate-400 mt-1">Robert Mugabe Square, Harare, Zimbabwe</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Phone & WhatsApp</h4>
                  <a href="tel:+263714887143" className="text-xs text-slate-300 hover:text-amber-400 block mt-1">
                    Phone: +263 71 488 7143
                  </a>
                  <a href="https://wa.me/263772765757" target="_blank" rel="noreferrer" className="text-[11px] text-emerald-400 font-semibold hover:underline block mt-0.5">
                    WhatsApp: +263 77 276 5757
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Address</h4>
                  <a href="mailto:famousdrivingschool@gmail.com" className="text-xs text-slate-300 hover:text-amber-400 block mt-1">
                    famousdrivingschool@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Location Operating Status */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Office Operating Status
            </h4>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium">Currently:</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open for Bookings & Inquiries</span>
              </span>
            </div>
          </div>

        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Send Us A Message</h3>
              <p className="text-xs text-slate-400">Fill in your details below and our customer care team will get back to you shortly.</p>
            </div>

            {submittedSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300">Thank you for contacting Famous Driving School. We have received your message.</p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-slate-800 text-slate-200 text-xs hover:bg-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nigel Mupira"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="077 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Provisional Theory Lessons">Provisional Theory Lessons ($15)</option>
                      <option value="Class 4 Driving Package">Class 4 Driving Package</option>
                      <option value="Class 2 Heavy Driving Package">Class 2 Heavy Driving Package</option>
                      <option value="Combo Package Pricing">Combo Package Pricing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows="5"
                    placeholder="Write your questions or notes here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Message...' : 'Send Message Now'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
