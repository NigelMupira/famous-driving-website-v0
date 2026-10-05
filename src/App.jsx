import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import Help from './pages/Help';
import Admin from './pages/Admin';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} setToast={setToast} />;
      case 'about':
        return <About setActiveTab={setActiveTab} />;
      case 'services':
        return <Services setActiveTab={setActiveTab} />;
      case 'booking':
        return <Booking setToast={setToast} />;
      case 'contact':
        return <Contact setToast={setToast} />;
      case 'reviews':
        return <Reviews setToast={setToast} />;
      case 'help':
        return <Help setActiveTab={setActiveTab} />;
      case 'admin':
        return <Admin setToast={setToast} />;
      default:
        return <Home setActiveTab={setActiveTab} setToast={setToast} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 animate-in fade-in duration-300">
        {renderActivePage()}
      </main>

      <Footer setActiveTab={setActiveTab} />
      
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
