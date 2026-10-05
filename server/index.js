import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDB } from './db/index.js';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seed data
initDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allowed for inline assets/Vite integration in dev
}));
app.use(cors());
app.use(express.json());

// Rate Limiter for Booking & Contact endpoints (Anti-Spam)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // max 10 submissions per 10 mins
  message: { error: 'Submission limit reached. Please wait before submitting again.' }
});

app.use('/api', apiLimiter);

// --- API ENDPOINTS ---

// 1. Get Courses Catalog
app.get('/api/courses', (req, res) => {
  try {
    const courses = db.prepare('SELECT * FROM courses').all();
    const formatted = courses.map(c => ({
      ...c,
      features: JSON.parse(c.features)
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get Instructors List
app.get('/api/instructors', (req, res) => {
  try {
    const instructors = db.prepare('SELECT * FROM instructors').all();
    res.json({ success: true, data: instructors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Available Booking Slots for a Date
app.get('/api/bookings/slots', (req, res) => {
  const { date } = req.query;
  const allSlots = [
    '08:00 AM - 09:00 AM',
    '09:15 AM - 10:15 AM',
    '10:30 AM - 11:30 AM',
    '11:45 AM - 12:45 PM',
    '02:00 PM - 03:00 PM',
    '03:15 PM - 04:15 PM',
    '04:30 PM - 05:30 PM'
  ];

  if (!date) {
    return res.json({ success: true, data: allSlots });
  }

  try {
    const takenBookings = db.prepare('SELECT preferred_time FROM bookings WHERE preferred_date = ?').all(date);
    const takenSlots = takenBookings.map(b => b.preferred_time);
    const available = allSlots.map(slot => ({
      time: slot,
      isAvailable: !takenSlots.includes(slot)
    }));
    res.json({ success: true, data: available });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create New Booking
const BookingSchema = z.object({
  student_name: z.string().min(2, 'Name must be at least 2 characters'),
  student_email: z.string().email('Invalid email address'),
  student_phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  course_id: z.string().min(1, 'Please select a course'),
  instructor_id: z.string().optional(),
  preferred_date: z.string().min(1, 'Please select a preferred date'),
  preferred_time: z.string().min(1, 'Please select a time slot')
});

app.post('/api/bookings', submitLimiter, (req, res) => {
  try {
    const validated = BookingSchema.parse(req.body);
    
    // Check slot availability
    const existing = db.prepare('SELECT id FROM bookings WHERE preferred_date = ? AND preferred_time = ?').get(
      validated.preferred_date,
      validated.preferred_time
    );

    if (existing) {
      return res.status(400).json({ success: false, error: 'The selected time slot is already booked. Please select another slot.' });
    }

    // Generate unique reference code (e.g. FDS-7A9K2)
    const refCode = 'FDS-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const stmt = db.prepare(`
      INSERT INTO bookings (reference_code, student_name, student_email, student_phone, course_id, instructor_id, preferred_date, preferred_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      refCode,
      validated.student_name,
      validated.student_email,
      validated.student_phone,
      validated.course_id,
      validated.instructor_id || 'Any Instructor',
      validated.preferred_date,
      validated.preferred_time
    );

    const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: newBooking
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Get Reviews & Testimonials
app.get('/api/reviews', (req, res) => {
  const { sort = 'newest', rating } = req.query;

  try {
    let query = 'SELECT * FROM reviews';
    const params = [];

    if (rating && rating !== 'all') {
      query += ' WHERE rating = ?';
      params.push(parseInt(rating));
    }

    if (sort === 'rating') {
      query += ' ORDER BY rating DESC, created_at DESC';
    } else if (sort === 'helpful') {
      query += ' ORDER BY helpful_votes DESC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const reviews = db.prepare(query).all(...params);

    // Calculate Summary Stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        AVG(rating) as average,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as star5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as star4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as star3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as star2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as star1
      FROM reviews
    `).get();

    res.json({
      success: true,
      data: reviews,
      stats: {
        total: stats.total || 0,
        average: stats.average ? Math.round(stats.average * 10) / 10 : 5.0,
        breakdown: {
          5: stats.star5 || 0,
          4: stats.star4 || 0,
          3: stats.star3 || 0,
          2: stats.star2 || 0,
          1: stats.star1 || 0,
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Submit New Review
const ReviewSchema = z.object({
  author_name: z.string().min(2, 'Name is required'),
  course_title: z.string().min(2, 'Course title is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters')
});

app.post('/api/reviews', submitLimiter, (req, res) => {
  try {
    const validated = ReviewSchema.parse(req.body);
    const stmt = db.prepare(`
      INSERT INTO reviews (author_name, course_title, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      validated.author_name,
      validated.course_title,
      validated.rating,
      validated.comment
    );

    const inserted = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Thank you for your review!',
      data: inserted
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Review Vote (Helpful / Unhelpful)
app.post('/api/reviews/:id/vote', (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body;

  if (!['helpful', 'unhelpful'].includes(voteType)) {
    return res.status(400).json({ success: false, error: 'Invalid vote type' });
  }

  try {
    const field = voteType === 'helpful' ? 'helpful_votes' : 'unhelpful_votes';
    db.prepare(`UPDATE reviews SET ${field} = ${field} + 1 WHERE id = ?`).run(id);

    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Submit Contact Message
const ContactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

app.post('/api/contact', submitLimiter, (req, res) => {
  try {
    const validated = ContactSchema.parse(req.body);
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      validated.name,
      validated.email,
      validated.phone || '',
      validated.subject,
      validated.message
    );

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! Our team will respond shortly.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Get FAQs
app.get('/api/faqs', (req, res) => {
  const { category, search } = req.query;

  try {
    let query = 'SELECT * FROM faqs WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (question LIKE ? OR answer LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const faqs = db.prepare(query).all(...params);
    res.json({ success: true, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Admin Authentication & Dashboard Data
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    if (admin && admin.password_hash === password) { // In production use bcrypt
      return res.json({ success: true, message: 'Authenticated successfully', token: 'fds-admin-token-2026' });
    }
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/dashboard', (req, res) => {
  try {
    const bookings = db.prepare(`
      SELECT b.*, c.title as course_title 
      FROM bookings b 
      LEFT JOIN courses c ON b.course_id = c.id 
      ORDER BY b.created_at DESC
    `).all();

    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    const reviewStats = db.prepare('SELECT COUNT(*) as count, AVG(rating) as avg FROM reviews').get();

    res.json({
      success: true,
      data: {
        bookings,
        messages,
        stats: {
          totalBookings: bookings.length,
          totalMessages: messages.length,
          totalReviews: reviewStats.count,
          avgRating: Math.round((reviewStats.avg || 5.0) * 10) / 10
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Static Frontend Assets in Production Mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚗 Famous Driving School API server running on http://localhost:${PORT}`);
});
