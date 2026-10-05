import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { fetchCourses } from '../services/api';

export default function Services({ setActiveTab }) {
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  const categories = ['All', 'Theory & Test Prep', 'Practical Driving', 'Specialized Training', 'Skills Refresh'];

  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Transparent Driving Packages
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Driving Courses & Transparent Pricing
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          No hidden fees, no surprise charges. Compare our accredited driving packages designed for absolute beginners, intermediate learners, and licensed drivers.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 max-w-3xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredCourses.map((course) => (
          <div key={course.id} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between relative group">
            {course.badge && (
              <span className="absolute top-6 right-6 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {course.badge}
              </span>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{course.category} • {course.code}</span>
                <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                  {course.title}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {course.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Investment</span>
                  <span className="text-3xl font-extrabold text-amber-400">${course.price}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Course Duration</span>
                  <span className="text-sm font-bold text-white">{course.duration}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Package Benefits Included:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {course.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-300 transition-all shadow-lg shadow-amber-500/20 text-center"
              >
                Enroll in This Course
              </button>
              <button
                onClick={() => setSelectedCourseModal(course)}
                className="px-4 py-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package Comparison Matrix */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Course Comparison Matrix</h2>
          <p className="text-xs text-slate-400">Quick side-by-side comparison of features included in each driving tier.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-200">
              <tr>
                <th className="p-4 font-bold">Feature / Benefit</th>
                <th className="p-4 font-bold text-amber-400">Learner's Theory</th>
                <th className="p-4 font-bold text-amber-400">Class 4 Practical</th>
                <th className="p-4 font-bold text-amber-400">Defensive Course</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-4 font-medium text-white">Highway Code Theory & Quizzes</td>
                <td className="p-4 text-emerald-400">✓ Full Access</td>
                <td className="p-4 text-emerald-400">✓ Included</td>
                <td className="p-4 text-emerald-400">✓ Advanced</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Behind-the-Wheel Practical Drills</td>
                <td className="p-4 text-slate-500">Theory Only</td>
                <td className="p-4 text-emerald-400">✓ 10 Lessons</td>
                <td className="p-4 text-emerald-400">✓ Full Day Workshop</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Dual-Control Car Safety Fleet</td>
                <td className="p-4 text-slate-500">N/A</td>
                <td className="p-4 text-emerald-400">✓ Included</td>
                <td className="p-4 text-emerald-400">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Parallel Park & 3-Point Turn Drills</td>
                <td className="p-4 text-slate-500">N/A</td>
                <td className="p-4 text-emerald-400">✓ Intensive</td>
                <td className="p-4 text-emerald-400">✓ Advanced</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Official Certificate Issued</td>
                <td className="p-4 text-emerald-400">✓ Prep Cert</td>
                <td className="p-4 text-emerald-400">✓ Road Test Cert</td>
                <td className="p-4 text-emerald-400">✓ Defensive Driving Cert</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full border border-amber-500/30 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400">{selectedCourseModal.category}</span>
                <h3 className="text-2xl font-bold text-white">{selectedCourseModal.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedCourseModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedCourseModal.description}
            </p>

            <div className="space-y-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Price:</span>
                <span className="font-bold text-amber-400 text-sm">${selectedCourseModal.price}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-white">{selectedCourseModal.duration}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Vehicle Code:</span>
                <span className="font-bold text-white">{selectedCourseModal.code}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCourseModal(null);
                setActiveTab('booking');
              }}
              className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-sm"
            >
              Proceed to Book {selectedCourseModal.title}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
