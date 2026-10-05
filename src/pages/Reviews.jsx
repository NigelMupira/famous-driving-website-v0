import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquarePlus, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import StarRating from '../components/StarRating';
import { fetchReviews, submitReview, voteReview } from '../services/api';

export default function Reviews({ setToast }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, average: 5.0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [sort, setSort] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Submit Modal State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author_name: '',
    course_title: 'Light Motor Vehicle (Class 4 Practical)',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  async function loadReviewData() {
    setLoading(true);
    try {
      const data = await fetchReviews(sort, ratingFilter);
      setReviews(data.data || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviewData();
  }, [sort, ratingFilter]);

  const handleVote = async (id, voteType) => {
    try {
      const updated = await voteReview(id, voteType);
      setReviews(prev => prev.map(r => r.id === id ? updated : r));
      setToast({ type: 'success', message: 'Thank you for your feedback!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.author_name || !newReview.comment) {
      setToast({ type: 'error', message: 'Please complete your name and review comment.' });
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(newReview);
      setToast({ type: 'success', message: 'Review submitted successfully!' });
      setShowSubmitModal(false);
      setNewReview({
        author_name: '',
        course_title: 'Light Motor Vehicle (Class 4 Practical)',
        rating: 5,
        comment: ''
      });
      loadReviewData();
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
          Student Voices & Ratings
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ratings & Verified Reviews
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Read genuine feedback from thousands of successful students who passed their road tests with Famous Driving School.
        </p>
      </div>

      {/* Aggregate Rating Dashboard */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Rating Big Number */}
          <div className="lg:col-span-4 text-center lg:text-left space-y-3 lg:border-r lg:border-slate-800 lg:pr-8">
            <span className="text-5xl sm:text-6xl font-extrabold text-white">{stats.average}</span>
            <div className="flex justify-center lg:justify-start">
              <StarRating rating={Math.round(stats.average)} size="lg" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Based on {stats.total} verified student reviews</p>
            
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave Your Review</span>
            </button>
          </div>

          {/* Breakdown Bars */}
          <div className="lg:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.breakdown[stars] || 0;
              const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-4 text-xs">
                  <span className="w-12 text-slate-300 font-semibold">{stars} Stars</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-slate-400 font-mono">{count}</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Sorting & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filter Reviews:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto">
          {/* Rating filter select */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
          >
            <option value="all">All Ratings (1-5 Stars)</option>
            <option value="5">5 Star Reviews</option>
            <option value="4">4 Star Reviews</option>
            <option value="3">3 Star Reviews</option>
          </select>

          {/* Sort select */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none text-xs"
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="rating">Sort by: Highest Rated</option>
            <option value="helpful">Sort by: Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List Grid */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Loading verified student reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 space-y-3 glass-panel rounded-3xl p-8">
            <p className="text-sm font-bold text-slate-300">No reviews found matching the selected filter.</p>
            <button
              onClick={() => { setRatingFilter('all'); setSort('newest'); }}
              className="text-xs text-amber-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span>{rev.author_name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" title="Verified Student" />
                      </h4>
                      <p className="text-xs text-amber-400/90 font-medium">{rev.course_title}</p>
                    </div>
                    <StarRating rating={rev.rating} size="sm" />
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">{new Date(rev.created_at).toLocaleDateString()}</span>

                  {/* Helpful / Unhelpful voting buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-semibold text-slate-500">Helpful?</span>
                    
                    <button
                      onClick={() => handleVote(rev.id, 'helpful')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">{rev.helpful_votes}</span>
                    </button>

                    <button
                      onClick={() => handleVote(rev.id, 'unhelpful')}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">{rev.unhelpful_votes}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full border border-amber-500/40 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Leave a Review</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={newReview.author_name}
                  onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Completed</label>
                <select
                  value={newReview.course_title}
                  onChange={(e) => setNewReview({ ...newReview, course_title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Light Motor Vehicle (Class 4 Practical)">Class 4 Practical Driving</option>
                  <option value="Learner's Permit Mastery Course">Learner's Theory Mastery</option>
                  <option value="Advanced Defensive Driving Certification">Defensive Driving Certification</option>
                  <option value="Confidence & Refresher Package">Refresher Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Rating</label>
                <StarRating rating={newReview.rating} setRating={(r) => setNewReview({ ...newReview, rating: r })} interactive size="md" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Feedback / Review Comment *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Tell us about your instructor, pass rate experience, or vehicle condition..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-xs"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
