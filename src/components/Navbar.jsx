import React, { useState } from 'react';
import { ShieldCheck, Calendar, Phone, Menu, X, Award, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'booking', label: 'Book Lesson' },
    { id: 'reviews', label: 'Ratings & Reviews' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'help', label: 'Help & FAQ' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-xs font-medium text-amber-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Harare's Certified Premier Driving Academy — 99.4% Pass Rate</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 hidden md:flex">
            <a href="tel:+263771234567" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+263 77 123 4567</span>
            </a>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Slots Available Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative">
              <img 
                src="/assets/logo.png" 
                alt="Famous Driving School" 
                className="h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  FAMOUS
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  DRIVING
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">
                Steer Your Way to Success
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTA & Admin Button */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Admin Portal"
            >
              <UserCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => handleNavClick('booking')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Online</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('booking')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="flex-1 py-3 text-center rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700"
            >
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
