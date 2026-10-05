import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, HelpCircle, BookOpen, ShieldCheck, PhoneCall, FileText } from 'lucide-react';
import { fetchFaqs } from '../services/api';

export default function Help({ setActiveTab }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function loadFaqData() {
      setLoading(true);
      try {
        const data = await fetchFaqs(category, search);
        setFaqs(data);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFaqData();
  }, [category, search]);

  const categories = ['All', 'Learner Permits', 'Booking & Lessons', 'Testing & Pass Rates', 'Vehicles & Safety', 'Pricing & Refunds'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Knowledge Base & Support
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Help Center & FAQs
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Find instant answers to common questions regarding driving permit requirements, lesson schedules, VID exams, and safety policies.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs (e.g., permit documents, booking, pass rates...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm shadow-xl"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* FAQ Accordion List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading FAQ knowledge base...</p>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 space-y-3 glass-panel rounded-3xl p-8">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No matching help articles found.</p>
            <button
              onClick={() => { setCategory('All'); setSearch(''); }}
              className="text-xs text-amber-400 underline"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">{faq.question}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180 text-amber-400' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 text-center space-y-4 max-w-3xl mx-auto">
        <PhoneCall className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Still Have Questions?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Can't find the answer you're looking for? Reach out directly to our student support team for immediate assistance.
        </p>
        <button
          onClick={() => {
            setActiveTab('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-xs"
        >
          Contact Support Desk
        </button>
      </div>

    </div>
  );
}
