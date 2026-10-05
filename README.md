# 🚗 Famous Driving School — Fullstack Web Application (v2.0 Overhaul)

[![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-emerald?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19.0-blue?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-cyan?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-Built--in_Database-lightgrey?style=flat-square&logo=sqlite)](https://www.sqlite.org)
[![Git Branch](https://img.shields.io/badge/Legacy_Branch-legacy--v1-amber?style=flat-square&logo=git)](https://github.com/NigelMupira/famous-driving-website--og/tree/legacy-v1)

A complete industry-standard overhaul of the **Famous Driving School** web platform. Transformed from a basic group student assignment into a modern, fullstack Single Page Application (SPA) with dynamic state transitions, responsive glassmorphic UI, Node.js REST API server, SQLite persistent database, and robust security controls.

---

## 🌟 Key Features

### 🖥️ Frontend & UI/UX (Single Page Application)
- **Dynamic Component Architecture**: Seamless SPA tab transitions with zero full-page reloads.
- **Modern Responsive Design**: Built with Tailwind CSS, custom glassmorphism, animated ambient glows, and responsive mobile drawer navigation.
- **Hero Section Overhaul**: Clean gradient hero highlighting statistics, dual-control safety badges, and an embedded 30-second quick slot reservation widget.
- **8 Core Functional Modules**:
  1. **Home**: Hero value propositions, quick booking widget, stat counters, course cards, live review preview.
  2. **About Us**: Brand origin story (Established 2014), mission & values, accredited badges, and interactive instructor profiles.
  3. **Services & Pricing**: Categorized course directory (Learner's Theory, Class 4 Practical, Defensive, Refresher), transparent cost breakdown, comparison matrix, and detail modals.
  4. **Booking & Scheduling**: Real-time slot availability checker, calendar date selector, instructor picker, and instant booking reference ticket generator.
  5. **Contact Us**: Form validation with instant feedback, direct action cards (Call, WhatsApp, Email), location cards, and operating hours indicator.
  6. **Ratings & Reviews**: Aggregate score summary with star breakdown bars, sortable review feed (Newest, Rating, Most Helpful), submission modal, and interactive **Helpful / Not Helpful** voting persistence.
  7. **Help & Searchable FAQ**: Searchable FAQ engine with category filters, collapsible accordions, and support ticket trigger.
  8. **Admin Portal**: Protected dashboard for driving school management displaying live statistics, pending student bookings, and message inbox.

---

## ⚙️ Backend & Security Architecture

- **Node.js / Express REST API**: Modular API endpoints handling courses, instructors, slot availability, booking confirmation, reviews, contact messages, and FAQs.
- **Embedded SQLite Database**: Self-contained persistent database storing relational data for bookings, reviews, and contact inquiries with parameterized SQL protection against SQL injection.
- **Security Controls**:
  - `helmet`: Security HTTP headers (XSS, MIME sniffing, clickjacking prevention).
  - `express-rate-limit`: Rate limiting on booking, review, and contact submissions (anti-spam protection).
  - `zod`: Strict request body schema validation.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS 4, Lucide Icons, Vite 6 |
| **Backend** | Node.js (v22), Express.js (v4), Zod Validation |
| **Database** | Embedded SQLite (`node:sqlite`) |
| **Security** | Helmet.js, Express Rate Limit, CORS, Parameterized SQL |
| **Tooling** | Concurrently, Vite Build Engine, Git |

---

## 📁 Project Structure

```
famous-driving-website--og/
├── index.html                   # SPA HTML Entry Point
├── package.json                 # Dependencies & Build Scripts
├── vite.config.js               # Vite Configuration & API Proxy
├── README.md                    # Project Documentation
│
├── public/                      # Static Assets
│   ├── favicon.ico
│   └── assets/
│       └── logo.png             # Official Famous Driving School Logo
│
├── server/                      # Node.js Express REST Backend
│   ├── index.js                 # API Server Entry & Security Middleware
│   └── db/
│       ├── index.js             # SQLite DB Schema Initialization & Seed Data
│       └── famous_driving.db    # SQLite Database File
│
└── src/                         # React Frontend SPA Codebase
    ├── main.jsx                 # React DOM Root
    ├── App.jsx                  # Main SPA Container & Tab Router
    ├── index.css                # Tailwind Directives & Custom Glass Styles
    │
    ├── components/              # Shared UI Components
    │   ├── Navbar.jsx           # Responsive SPA Header & Mobile Drawer
    │   ├── Footer.jsx           # Footer Links & Training Hours
    │   ├── Toast.jsx            # Notification Toast System
    │   └── StarRating.jsx       # Interactive Star Rating Component
    │
    ├── pages/                   # SPA Page Views
    │   ├── Home.jsx             # Landing Page & Quick Booking Widget
    │   ├── About.jsx            # Brand Origin & Instructor Showcase
    │   ├── Services.jsx         # Course Catalog & Comparison Matrix
    │   ├── Booking.jsx          # Live Scheduling & Confirmation Ticket
    │   ├── Contact.jsx          # Contact Form & Live Status
    │   ├── Reviews.jsx          # Verified Reviews & Voting System
    │   ├── Help.jsx             # Searchable FAQ Knowledge Base
    │   └── Admin.jsx            # Executive Admin Dashboard
    │
    └── services/
        └── api.js               # API Client Fetch Helpers
```

---

## 🚀 Local Development & Setup Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22 recommended)
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/NigelMupira/famous-driving-website--og.git
cd famous-driving-website--og
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server (Frontend + Backend Concurrently)
```bash
npm run dev
```
This starts:
- **Backend REST API**: Running on `http://localhost:5000`
- **Vite React Dev Server**: Running on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`.

---

## 🔑 Admin Dashboard Access

To access the Executive Admin Portal:
1. Navigate to the **Admin** tab or visit `http://localhost:3000` and select **Admin**.
2. **Default Credentials**:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 📦 Production Build & Deployment

To generate an optimized production build:

```bash
npm run build
```

To run the production server (serving compiled static assets + API):

```bash
npm run start
```

---

## 📜 Legacy Branch Info

The original student assignment code submitted over a year ago by group members is fully preserved in the [`legacy-v1`](https://github.com/NigelMupira/famous-driving-website--og/tree/legacy-v1) branch.

---

## 👥 Original Student Group Contributors

- **Kapfidze Tadiwanashe**
- **Kudumba Tafadzwa**
- **Kundishora Vongayi**
- **Mupira Nigel**
- **Ngwerume Makatida**
- **Mandimika Ropafadzo**
- **Nhekairo Tanaka**

*Harare Institute of Technology — School of Information Science and Technology (ISS1205 Web Technologies)*
