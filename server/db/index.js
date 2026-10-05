import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'famous_driving.db');
const db = new DatabaseSync(dbPath);

// Enable Foreign Keys & Write-Ahead Logging
db.exec('PRAGMA foreign_keys = ON;');

// Initialize Tables
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      price INTEGER NOT NULL,
      badge TEXT,
      features TEXT NOT NULL,
      code TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS instructors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      experience TEXT NOT NULL,
      qualifications TEXT NOT NULL,
      rating REAL NOT NULL,
      specialty TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_code TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_phone TEXT NOT NULL,
      course_id TEXT NOT NULL,
      instructor_id TEXT,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      status TEXT DEFAULT 'Confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_name TEXT NOT NULL,
      course_title TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      helpful_votes INTEGER DEFAULT 0,
      unhelpful_votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'Unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  // Seed default data if courses empty
  const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get();
  if (courseCount.count === 0) {
    seedData();
  }
}

function seedData() {
  // Seed Courses
  const courses = [
    {
      id: 'learner-prep',
      title: 'Learner\'s Permit Mastery Course',
      category: 'Theory & Test Prep',
      description: 'Comprehensive highway code, traffic signs, rules of the road, and mock examination preparation.',
      duration: '2 Weeks (Theory & Practice)',
      price: 65,
      badge: 'Most Popular',
      features: JSON.stringify(['Complete Highway Code Manual', '100+ Mock Exam Questions', 'Interactive Sign Quiz Engine', 'VID Examination Guarantee']),
      code: 'Class 4 Theory'
    },
    {
      id: 'practical-code-8',
      title: 'Light Motor Vehicle (Class 4 Practical)',
      category: 'Practical Driving',
      description: 'Hands-on behind-the-wheel instruction in modern dual-control sedans covering parallel parking, three-point turns, and road driving.',
      duration: '10 Lessons (1 hr each)',
      price: 180,
      badge: 'Best Value',
      features: JSON.stringify(['Dual-Control Safety Vehicles', '3-Point Turn & Parallel Park Training', 'City & Highway Road Practice', 'Flexible Scheduling']),
      code: 'Class 4'
    },
    {
      id: 'defensive-driving',
      title: 'Advanced Defensive Driving Certification',
      category: 'Specialized Training',
      description: 'Hazard identification, adverse weather navigation, collision avoidance techniques, and certified defensive driving qualification.',
      duration: '1 Full Day Workshop',
      price: 120,
      badge: 'Certified',
      features: JSON.stringify(['Official Defensive Certificate', 'Emergency Braking & Skid Control', 'Night & Bad Weather Drills', 'Corporate Discount Available']),
      code: 'Defensive'
    },
    {
      id: 'refresher-course',
      title: 'Confidence & Refresher Package',
      category: 'Skills Refresh',
      description: 'Tailored for licensed drivers needing to regain confidence in dense city traffic, highway merging, or parking.',
      duration: '5 Lessons (1 hr each)',
      price: 95,
      badge: 'Quick Boost',
      features: JSON.stringify(['Custom Focus Areas', 'Harare CBD Traffic Handling', 'Night Driving Drills', 'Instructor Feedback Report']),
      code: 'Refresher'
    }
  ];

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, category, description, duration, price, badge, features, code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of courses) {
    insertCourse.run(c.id, c.title, c.category, c.description, c.duration, c.price, c.badge, c.features, c.code);
  }

  // Seed Instructors
  const instructors = [
    {
      id: 'inst-1',
      name: 'Tafadzwa Kudumba',
      title: 'Senior Chief Driving Instructor',
      bio: 'Over 12 years of driving instruction experience with an outstanding 99.6% student pass rate.',
      experience: '12+ Years',
      qualifications: 'Certified Advanced VID Driving Instructor, Defensive Master Trainer',
      rating: 4.9,
      specialty: 'Class 4 Practical & Parallel Parking'
    },
    {
      id: 'inst-2',
      name: 'Vongayi Kundishora',
      title: 'Lead Theory & Defensive Specialist',
      bio: 'Specializes in high-anxiety student coaching, turning nervous beginners into calm, confident drivers.',
      experience: '8+ Years',
      qualifications: 'BSc Safety Management, Certified Highway Code Examiner',
      rating: 4.95,
      specialty: 'Defensive Driving & Traffic Theory'
    },
    {
      id: 'inst-3',
      name: 'Makatida Ngwerume',
      title: 'Fleet & Practical Instructor',
      bio: 'Patient and articulate instructor focused on precision vehicle control and city traffic navigation.',
      experience: '6+ Years',
      qualifications: 'Class 2 & Class 4 Certified Instructor',
      rating: 4.88,
      specialty: 'City Road Mastery & Night Drills'
    }
  ];

  const insertInstructor = db.prepare(`
    INSERT INTO instructors (id, name, title, bio, experience, qualifications, rating, specialty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inst of instructors) {
    insertInstructor.run(inst.id, inst.name, inst.title, inst.bio, inst.experience, inst.qualifications, inst.rating, inst.specialty);
  }

  // Seed Initial Reviews
  const reviews = [
    {
      author_name: 'Nigel Mupira',
      course_title: 'Light Motor Vehicle (Class 4 Practical)',
      rating: 5,
      comment: 'From nervous to completely confident! Tafadzwa broke down parallel parking into simple steps. Passed my VID road test on the very first try!',
      helpful_votes: 14,
      unhelpful_votes: 0
    },
    {
      author_name: 'Tanaka Nhekairo',
      course_title: 'Learner\'s Permit Mastery Course',
      rating: 5,
      comment: 'The mock quizzes and interactive sign tests were identical to the real test questions. Scored 24/25 on my provisional test!',
      helpful_votes: 9,
      unhelpful_votes: 1
    },
    {
      author_name: 'Ropafadzo Mandimika',
      course_title: 'Advanced Defensive Driving Certification',
      rating: 5,
      comment: 'Incredible workshop! The emergency braking drills and hazard recognition scenarios were eye-opening. Highly recommend to every driver.',
      helpful_votes: 11,
      unhelpful_votes: 0
    },
    {
      author_name: 'Tadiwanashe Kapfidze',
      course_title: 'Confidence & Refresher Package',
      rating: 5,
      comment: 'Great refresher course after not driving for 3 years. Clear guidance, dual control safety, and very patient staff.',
      helpful_votes: 6,
      unhelpful_votes: 0
    }
  ];

  const insertReview = db.prepare(`
    INSERT INTO reviews (author_name, course_title, rating, comment, helpful_votes, unhelpful_votes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const r of reviews) {
    insertReview.run(r.author_name, r.course_title, r.rating, r.comment, r.helpful_votes, r.unhelpful_votes);
  }

  // Seed FAQs
  const faqs = [
    {
      category: 'Learner Permits',
      question: 'What documents do I need to enroll for a Learner\'s Permit class?',
      answer: 'You will need a valid National I.D. or Passport, two passport-sized photographs, and be at least 16 years of age for Class 4.'
    },
    {
      category: 'Booking & Lessons',
      question: 'Can I choose my preferred driving instructor and schedule?',
      answer: 'Yes! Our dynamic booking system allows you to select your preferred instructor, date, and 1-hour time slot based on live availability.'
    },
    {
      category: 'Testing & Pass Rates',
      question: 'What is Famous Driving School\'s pass rate for first-time test takers?',
      answer: 'Our students achieve a 99.4% first-time pass rate on provisional theory tests and over 94% first-time pass rate on VID practical tests.'
    },
    {
      category: 'Vehicles & Safety',
      question: 'Are your instruction vehicles safe and dual-controlled?',
      answer: 'All Famous Driving School vehicles are modern, regularly serviced, fully insured, and equipped with certified instructor dual-control brake/clutch systems.'
    },
    {
      category: 'Pricing & Refunds',
      question: 'Do you offer installment payment options for full driving packages?',
      answer: 'Yes, we offer flexible 2-part installment options for complete Class 4 packages so you can pay as you progress.'
    }
  ];

  const insertFaq = db.prepare(`
    INSERT INTO faqs (category, question, answer)
    VALUES (?, ?, ?)
  `);

  for (const f of faqs) {
    insertFaq.run(f.category, f.question, f.answer);
  }

  // Seed Admin Account (Password: admin123)
  db.prepare(`
    INSERT INTO admins (username, password_hash)
    VALUES ('admin', 'admin123')
  `).run();
}

export default db;
