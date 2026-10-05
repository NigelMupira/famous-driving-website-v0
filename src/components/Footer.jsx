import React from 'react';
import { MapPin, Phone, Mail, Clock, Award, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/logo.png" 
                alt="Famous Driving School" 
                className="h-10 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-xl font-extrabold text-white tracking-tight">
                FAMOUS <span className="text-amber-400">DRIVING</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Harare's trusted driving school since 2014. Committed to highway safety, certified excellence, and turning beginners into confident drivers.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>VID Accredited & Certified</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Us & Mission' },
                { id: 'services', label: 'Courses & Pricing' },
                { id: 'booking', label: 'Online Slot Booking' },
                { id: 'reviews', label: 'Student Testimonials' },
                { id: 'help', label: 'Help & FAQs' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <span className="text-amber-500 text-xs">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Location</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Harare Institute of Technology / CBD Campus, Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <a href="tel:+263771234567" className="hover:text-white transition-colors">+263 77 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <a href="mailto:info@famousdrivingschool.co.zw" className="hover:text-white transition-colors">info@famousdrivingschool.co.zw</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Training Hours</h4>
            <div className="space-y-2 text-sm bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Mon - Fri:</span>
                <span className="font-semibold text-white">07:00 - 17:30</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span>Saturday:</span>
                <span className="font-semibold text-white">08:00 - 15:00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span>Sunday:</span>
                <span className="text-amber-400 font-medium">By Appointment</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Famous Driving School. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>HIT ISS1205 Web Technologies Project Overhaul</span>
            <span>•</span>
            <button 
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-amber-400 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
