import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Clear existing and re-seed authentic legacy data
  db.exec('DELETE FROM courses;');
  db.exec('DELETE FROM instructors;');
  db.exec('DELETE FROM reviews;');
  db.exec('DELETE FROM faqs;');
  
  seedAuthenticLegacyData();
}

function seedAuthenticLegacyData() {
  // Seed Authentic Courses & Combos from original group assignment
  const courses = [
    {
      id: 'provisional-lessons',
      title: 'Provisional Theory Lessons (Class 2 & Class 4)',
      category: 'Theory & Test Prep',
      description: 'Complete Highway Code theory, road traffic signs, and practice tests for Class 2 and Class 4 provisional licenses.',
      duration: 'Unlimited Until You Pass',
      price: 15,
      badge: 'Essential',
      features: JSON.stringify(['Highway Code Manual Included', 'Class 2 & Class 4 Sign Tests', 'Mock Exam Question Papers', 'Pass Guarantee Support']),
      code: 'Class 2 & 4 Theory'
    },
    {
      id: 'class-4-lesson',
      title: 'Class 4 Single Driving Lesson (Light Vehicles)',
      category: 'Practical Driving',
      description: 'Behind-the-wheel practical driving instruction in dual-controlled light motor vehicles.',
      duration: 'Per 1-Hour Lesson',
      price: 5,
      badge: 'Pay As You Go',
      features: JSON.stringify(['Dual-Control Sedan', 'Parallel Parking & 3-Point Turn', 'CBD City Driving', 'Patient Experienced Instructor']),
      code: 'Class 4 Single'
    },
    {
      id: 'class-2-lesson',
      title: 'Class 2 Single Driving Lesson (Heavy Vehicles)',
      category: 'Practical Driving',
      description: 'Behind-the-wheel practical driving instruction in heavy motor vehicles (trucks/buses).',
      duration: 'Per 1-Hour Lesson',
      price: 7,
      badge: 'Heavy Vehicle',
      features: JSON.stringify(['Heavy Vehicle Dual Control', 'Clutch & Gear Control', 'Reversing & Docking Drills', 'Certified Class 2 Instructor']),
      code: 'Class 2 Single'
    },
    {
      id: 'combo-c4-lite',
      title: 'Class 4 Combo Lite Package',
      category: 'Combo Package',
      description: 'Complete entry package covering provisional lessons, 10 practical driving lessons, and vehicle hire for your VID test.',
      duration: '10 Lessons + Car Hire',
      price: 100,
      badge: 'Popular Combo',
      features: JSON.stringify(['Provisional Theory Lessons', '10 Class 4 Driving Lessons', 'VID Test Car Hire', 'Save vs Single Lessons']),
      code: 'Class 4 Combo'
    },
    {
      id: 'combo-c4-ultra',
      title: 'Class 4 Combo Ultra Package',
      category: 'Combo Package',
      description: 'Recommended comprehensive package featuring provisional lessons, 20 practical driving lessons, and VID test car hire.',
      duration: '20 Lessons + Car Hire',
      price: 140,
      badge: 'Best Value',
      features: JSON.stringify(['Provisional Theory Lessons', '20 Class 4 Driving Lessons', 'VID Test Car Hire', 'Mock Test Evaluation']),
      code: 'Class 4 Combo'
    },
    {
      id: 'combo-c4-ultimate',
      title: 'Class 4 Combo Ultimate Package',
      category: 'Combo Package',
      description: 'Mastery package for absolute beginners with provisional lessons, 30 practical driving lessons, and VID test car hire.',
      duration: '30 Lessons + Car Hire',
      price: 170,
      badge: 'Complete Mastery',
      features: JSON.stringify(['Provisional Theory Lessons', '30 Class 4 Driving Lessons', 'VID Test Car Hire', 'High-Confidence Guarantee']),
      code: 'Class 4 Combo'
    },
    {
      id: 'combo-c2-lite',
      title: 'Class 2 Heavy Vehicle Combo Lite',
      category: 'Heavy Combo',
      description: 'Heavy vehicle package including provisional lessons, 10 Class 2 driving lessons, and heavy truck VID test car hire.',
      duration: '10 Heavy Lessons + Truck Hire',
      price: 150,
      badge: 'Heavy Lite',
      features: JSON.stringify(['Provisional Theory Lessons', '10 Class 2 Driving Lessons', 'Heavy Truck VID Hire', 'Professional Coaching']),
      code: 'Class 2 Combo'
    },
    {
      id: 'combo-c2-ultra',
      title: 'Class 2 Heavy Vehicle Combo Ultra',
      category: 'Heavy Combo',
      description: 'Popular heavy vehicle package including provisional lessons, 20 Class 2 driving lessons, and truck hire.',
      duration: '20 Heavy Lessons + Truck Hire',
      price: 180,
      badge: 'Heavy Recommended',
      features: JSON.stringify(['Provisional Theory Lessons', '20 Class 2 Driving Lessons', 'Heavy Truck VID Hire', 'Complete Road Maneuvers']),
      code: 'Class 2 Combo'
    },
    {
      id: 'combo-c2-ultimate',
      title: 'Class 2 Heavy Vehicle Combo Ultimate',
      category: 'Heavy Combo',
      description: 'Ultimate heavy vehicle mastery package with provisional lessons, 30 Class 2 driving lessons, and truck hire.',
      duration: '30 Heavy Lessons + Truck Hire',
      price: 210,
      badge: 'Heavy Ultimate',
      features: JSON.stringify(['Provisional Theory Lessons', '30 Class 2 Driving Lessons', 'Heavy Truck VID Hire', 'Commercial Fleet Readiness']),
      code: 'Class 2 Combo'
    }
  ];

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, category, description, duration, price, badge, features, code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of courses) {
    insertCourse.run(c.id, c.title, c.category, c.description, c.duration, c.price, c.badge, c.features, c.code);
  }

  // Seed Authentic Instructors (Frank, Jon, Tatenda, Mr. Moyo)
  const instructors = [
    {
      id: 'inst-frank',
      name: 'Frank',
      title: 'Senior Class 4 Driving Instructor',
      bio: 'Known for going out of his way to support students through tight schedules and intensive test preparation.',
      experience: '10+ Years',
      qualifications: 'Certified Class 4 Instructor, Customer Choice Award',
      rating: 4.95,
      specialty: 'Class 4 Practical & Intensive Coaching'
    },
    {
      id: 'inst-jon',
      name: 'Jon',
      title: 'Intensive Course & Confidence Trainer',
      bio: 'Renowned for his calm demeanor, spotless training vehicles, and humorous supportive coaching style.',
      experience: '8+ Years',
      qualifications: 'Certified Driving Instructor, First-Time Pass Specialist',
      rating: 4.92,
      specialty: 'Intensive Courses & First-Time Test Prep'
    },
    {
      id: 'inst-tatenda',
      name: 'Tatenda',
      title: 'Practical Road Test Specialist',
      bio: 'Deep knowledge of VID examination criteria, helping learners overcome nervous habits before test day.',
      experience: '7+ Years',
      qualifications: 'Certified Driving Instructor, Defensive Driving Trainer',
      rating: 4.98,
      specialty: 'VID Test Routes & Road Readiness'
    },
    {
      id: 'inst-moyo',
      name: 'Mr. Moyo',
      title: 'Class 2 & Class 4 Instructor',
      bio: 'Experienced instructor providing methodical instruction for both light and heavy motor vehicles.',
      experience: '12+ Years',
      qualifications: 'Certified Class 2 & Class 4 Instructor',
      rating: 4.85,
      specialty: 'Class 2 Heavy Vehicles & City Traffic'
    }
  ];

  const insertInstructor = db.prepare(`
    INSERT INTO instructors (id, name, title, bio, experience, qualifications, rating, specialty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const inst of instructors) {
    insertInstructor.run(inst.id, inst.name, inst.title, inst.bio, inst.experience, inst.qualifications, inst.rating, inst.specialty);
  }

  // Seed Authentic Reviews from original group assignment
  const reviews = [
    {
      author_name: 'Nigel Mupira',
      course_title: 'Class 4 Combo Ultra Package',
      rating: 5,
      comment: 'The team go out of their way to support the learners. The ladies at Reception all work so well together and really try to accommodate a dynamic situation. Frank my instructor was very busy but managed to fit me in and again went out of his way to support me. I have yet to find any business as focused on customer support, thank you guys highly recommend for all your driving needs.',
      helpful_votes: 18,
      unhelpful_votes: 0
    },
    {
      author_name: 'Tafadzwa Kudumba',
      course_title: 'Provisional Theory Lessons',
      rating: 5,
      comment: 'I had a great experience with this driving school. The instructor was patient and knowledgeable. Passed my provisional theory exam with ease!',
      helpful_votes: 12,
      unhelpful_votes: 0
    },
    {
      author_name: 'Trevor Majora',
      course_title: 'Class 4 Single Driving Lesson',
      rating: 5,
      comment: 'Jon the best driving instructor! Where do I start with Jon, he’s honestly lovely, calm and a great driving instructor. Did an intensive course and in just over a month with him I managed to pass first time with 5 minors. His car was always clean which was amazing and his humour kept me going through challenging times.',
      helpful_votes: 15,
      unhelpful_votes: 1
    },
    {
      author_name: 'Tanaka Nhekairo',
      course_title: 'Class 4 Combo Lite Package',
      rating: 5,
      comment: 'I have had Mr Moyo as my driving instructor for the last few months. Over this time he has worked with me to improve my driving skill and build my confidence on the road, ultimately enabling me to pass my driving test. Instructions were calm and coherent. Many thanks to Famous Driving School!',
      helpful_votes: 14,
      unhelpful_votes: 0
    },
    {
      author_name: 'Vongai Maripisa',
      course_title: 'Class 4 Combo Ultimate Package',
      rating: 5,
      comment: 'Tatenda was the best driving instructor I have ever been taught by! His experience and knowledge taught me loads to get me where I needed to be on test day! Reason I passed! Couldn’t give him enough credit!',
      helpful_votes: 10,
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

  // Seed Authentic FAQs
  const faqs = [
    {
      category: 'Pricing & Refunds',
      question: 'What are the prices for individual Class 4 and Class 2 driving lessons?',
      answer: 'Provisional theory lessons are $15 (unlimited until you pass). Class 4 single practical lessons are $5 per lesson, and Class 2 single practical lessons are $7 per lesson.'
    },
    {
      category: 'Pricing & Refunds',
      question: 'What is included in the Combo packages?',
      answer: 'All Class 4 and Class 2 Combo packages (Combo Lite, Combo Ultra, Combo Ultimate) include full provisional theory lessons, your selected number of driving lessons (10, 20, or 30), and car/truck hire for your official VID test.'
    },
    {
      category: 'Learner Permits',
      question: 'Do you offer provisional lessons for both Class 2 and Class 4?',
      answer: 'Yes! Our provisional theory package ($15) covers both Class 2 (heavy motor vehicles) and Class 4 (light motor vehicles).'
    },
    {
      category: 'Booking & Lessons',
      question: 'Where is Famous Driving School located and how do I contact support?',
      answer: 'We are located at Robert Mugabe Square, Harare, Zimbabwe. You can reach us via Phone at +263 71 488 7143, WhatsApp at +263 77 276 5757, or Email at famousdrivingschool@gmail.com.'
    }
  ];

  const insertFaq = db.prepare(`
    INSERT INTO faqs (category, question, answer)
    VALUES (?, ?, ?)
  `);

  for (const f of faqs) {
    insertFaq.run(f.category, f.question, f.answer);
  }

  // Ensure Admin User Exists
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get();
  if (adminCount.count === 0) {
    db.prepare(`
      INSERT INTO admins (username, password_hash)
      VALUES ('admin', 'admin123')
    `).run();
  }
}

export default db;
