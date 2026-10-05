import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Target, Heart, Users, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { fetchInstructors } from '../services/api';
import StarRating from '../components/StarRating';

export default function About({ setActiveTab }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstructors() {
      try {
        const data = await fetchInstructors();
        setInstructors(data);
      } catch (err) {
        console.error('Failed to load instructors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInstructors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Established 2014
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Our Origin, Mission & Team
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Famous Driving School was founded with a singular mission: to promote highway safety and deliver world-class driving education tailored for every student.
        </p>
      </div>

      {/* Brand Story & Origin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            The Famous Story
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            What started over a decade ago as a local family initiative has grown into Harare’s premier driving academy. Seeing the anxiety and frustration students experienced with conventional driving schools, Famous Driving School was restructured around student-first safety, patient instruction, and structured milestone progress.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Today, our fleet of dual-controlled vehicles and certified instructors have helped over 4,800 students earn their driver’s licenses with confidence and pride.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-800">
            <div>
              <p className="text-2xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Certified Instructors</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">12+ Years</p>
              <p className="text-xs text-slate-400 font-medium">Continuous Excellence</p>
            </div>
          </div>
        </div>

        {/* Core Mission & Values */}
        <div className="space-y-4">
          {[
            {
              icon: Target,
              title: 'Our Mission Statement',
              desc: 'To empower every student driver with lifelong defensive driving skills, comprehensive traffic knowledge, and absolute road confidence.'
            },
            {
              icon: ShieldCheck,
              title: 'Safety First Philosophy',
              desc: 'Zero compromises on vehicle safety. Every car in our fleet undergoes weekly multi-point mechanical inspections and is equipped with instructor dual controls.'
            },
            {
              icon: Heart,
              title: 'Empathy & Zero Intimidation',
              desc: 'We believe learning to drive should be empowering, not stressful. Our instructors are trained to support nervous beginners with calm guidance.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-12">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Selling Proposition & Credentials */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Our Credentials</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Accreditations & Official Qualifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Award className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">VID Accredited Academy</h4>
            <p className="text-xs text-slate-400">Officially certified driving institution compliant with national road safety boards.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <ShieldCheck className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Defensive Master Instructors</h4>
            <p className="text-xs text-slate-400">All instructors hold advanced defensive driving master certifications and clean safety records.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Users className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">HIT & Academic Partnerships</h4>
            <p className="text-xs text-slate-400">Proud partner for student driver education and road safety workshops in Harare.</p>
          </div>
        </div>
      </div>

      {/* Instructor Team Showcase */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Meet The Team</span>
          <h2 className="text-3xl font-extrabold text-white">Certified Lead Instructors</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Our team of friendly, experienced instructors are dedicated to guiding you through every step of your driving journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instructors.map((inst) => (
            <div key={inst.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{inst.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{inst.title}</p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{inst.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">"{inst.bio}"</p>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-bold text-white">{inst.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Specialty:</span>
                  <span className="font-bold text-white">{inst.specialty}</span>
                </div>
                <div className="pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Qualifications:</span> {inst.qualifications}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('booking')}
                className="w-full py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 transition-all border border-slate-700"
              >
                Book Lesson with {inst.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
