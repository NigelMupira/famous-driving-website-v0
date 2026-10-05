import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Calendar, Award, CheckCircle2, ArrowRight, Star, 
  Users, Car, Zap, Clock, ThumbsUp, Sparkles, ChevronRight 
} from 'lucide-react';
import StarRating from '../components/StarRating';
import { fetchCourses, fetchReviews, createBooking } from '../services/api';

export default function Home({ setActiveTab, setToast }) {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero Quick Booking State
  const [quickBooking, setQuickBooking] = useState({
    student_name: '',
    student_phone: '',
    course_id: 'practical-code-8',
    preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: '09:15 AM - 10:15 AM'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cData, rData] = await Promise.all([fetchCourses(), fetchReviews()]);
        setCourses(cData);
        setReviews(rData.data ? rData.data.slice(0, 3) : []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickBooking = async (e) => {
    e.preventDefault();
    if (!quickBooking.student_name || !quickBooking.student_phone) {
      setToast({ type: 'error', message: 'Please enter your name and phone number.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await createBooking({
        ...quickBooking,
        student_email: `${quickBooking.student_name.toLowerCase().replace(/\s+/g, '')}@student.fds`
      });
      setToast({
        type: 'success',
        message: `Booking Confirmed! Ref: ${res.data.reference_code}. We will call you shortly.`
      });
      setQuickBooking({
        student_name: '',
        student_phone: '',
        course_id: 'practical-code-8',
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        preferred_time: '09:15 AM - 10:15 AM'
      });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        
        {/* Modern Dynamic Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Headline & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase shadow-inner">
                <Sparkles className="w-4 h-4" />
                <span>Premier Accredited Driving Academy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Steer Your Way to <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  First-Try Driving Success.
                </span>
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed font-normal">
                Master the road with Harare’s most patient certified instructors, dual-control safety vehicles, and tailored behind-the-wheel lessons.
              </p>

              {/* Key Benefit Pill Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {[
                  { icon: ShieldCheck, text: '91.6% Pass Rate' },
                  { icon: Car, text: 'Dual-Control Cars' },
                  { icon: Users, text: 'Certified Instructors' },
                  { icon: Clock, text: 'Flexible Hours' },
                  { icon: Award, text: 'VID Exam Guarantee' },
                  { icon: ThumbsUp, text: 'Installment Pay' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-xs font-semibold">
                    <item.icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => setActiveTab('booking')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Your First Lesson</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Explore Courses & Prices</span>
                </button>
              </div>

            </div>

            {/* Right Hero Quick Booking Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/20 shadow-2xl relative">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Fast Track Registration
                </div>

                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Quick Slot Reservation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Reserve your preferred date in under 30 seconds. No advance payment required for initial inquiry.
                  </p>
                </div>

                <form onSubmit={handleQuickBooking} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={quickBooking.student_name}
                      onChange={(e) => setQuickBooking({ ...quickBooking, student_name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (WhatsApp)</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +263 70 000 0000"
                      value={quickBooking.student_phone}
                      onChange={(e) => setQuickBooking({ ...quickBooking, student_phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Driving Package</label>
                    <select
                      value={quickBooking.course_id}
                      onChange={(e) => setQuickBooking({ ...quickBooking, course_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-sm"
                    >
                      {courses.length > 0 ? (
                        courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} (${c.price})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="combo-c4-ultra">Class 4 Combo Ultra Package ($140)</option>
                          <option value="provisional-lessons">Provisional Theory Lessons ($15)</option>
                          <option value="class-4-lesson">Class 4 Single Driving Lesson ($5)</option>
                          <option value="class-2-lesson">Class 2 Heavy Driving Lesson ($7)</option>
                          <option value="combo-c2-ultra">Class 2 Heavy Combo Ultra ($180)</option>
                          <option value="specialized-night-weather">Night & Weather Navigation ($65)</option>
                          <option value="cbd-traffic-refresher">CBD Traffic Refresher ($45)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                      <input 
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={quickBooking.preferred_date}
                        onChange={(e) => setQuickBooking({ ...quickBooking, preferred_date: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
                      <select
                        value={quickBooking.preferred_time}
                        onChange={(e) => setQuickBooking({ ...quickBooking, preferred_time: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                      >
                        <option value="08:00 AM - 09:00 AM">08:00 AM</option>
                        <option value="09:15 AM - 10:15 AM">09:15 AM</option>
                        <option value="10:30 AM - 11:30 AM">10:30 AM</option>
                        <option value="02:00 PM - 03:00 PM">02:00 PM</option>
                        <option value="03:15 PM - 04:15 PM">03:15 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Slot Reservation'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* --- STATS COUNTER STRIP --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 glass-panel p-8 rounded-3xl border border-slate-800 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">91.6%</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Provisional Pass Rate</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">2,500+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Licensed Drivers Taught</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">12+</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Years of Excellence</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">4.5 / 5.0</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Average Student Rating</p>
          </div>
        </div>
      </section>


      {/* --- FEATURED COURSES SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Professional Packages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tailored Courses For Every Driving Level
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Whether you are preparing for your provisional theory exam or seeking behind-the-wheel mastery, we have the right package for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6 relative group">
              {course.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {course.badge}
                </span>
              )}

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{course.category}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-amber-400">${course.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{course.duration}</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {course.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setActiveTab('booking')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 transition-all border border-slate-700 hover:border-amber-500 flex items-center justify-center gap-1.5"
                >
                  <span>Select Package</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="bg-slate-950/80 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                The Famous Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Why Famous Driving School Outperforms The Rest
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Founded in 2014, our methodology combines modern road safety principles, dual-control safe vehicles, and empathetic instruction to ensure you build lifelong driving habits.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Empathetic & Patient Coaching', desc: 'Zero intimidation. We specialize in helping nervous and first-time drivers build calm confidence.' },
                  { title: 'Dual-Control Vehicle Fleet', desc: 'Train in modern, insured vehicles with instructor dual pedals ensuring 100% safety at all times.' },
                  { title: 'Comprehensive VID Exam Preparation', desc: 'Mock road tests covering parallel parking, 3-point turns, hill starts, and real exam routes.' },
                  { title: 'Transparent Pricing & Flexible Schedule', desc: 'No hidden fees. Pay per lesson or select discounted packages with morning, afternoon, and weekend slots.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Preview Grid */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Student Testimonials</h3>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All Reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">{rev.author_name}</p>
                          <p className="text-[10px] text-amber-400/90 font-medium">{rev.course_title}</p>
                        </div>
                        <StarRating rating={rev.rating} size="sm" />
                      </div>
                      <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
