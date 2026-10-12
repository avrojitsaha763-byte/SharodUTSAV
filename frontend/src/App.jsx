import React, { useState, useEffect } from 'react';
import { 
  Flame, Map, Calendar, Train, Utensils, Users, 
  AlertCircle, Radio, Camera, Gift, Globe, Shield, 
  ChevronRight, Sparkles, Navigation 
} from 'lucide-react';

import { useLanguage } from './context/LanguageContext';
import OfflineNotice from './components/OfflineNotice';
import LiveHeatmap from './components/LiveHeatmap';
import PandalGateNav from './components/PandalGateNav';
import ItineraryPlanner from './components/ItineraryPlanner';
import TransitGuide from './components/TransitGuide';
import AmenitiesRadar from './components/AmenitiesRadar';
import BondhuSOS from './components/BondhuSOS';
import TrafficSurge from './components/TrafficSurge';
import VintageRadio from './components/VintageRadio';
import InstaStudio from './components/InstaStudio';
import PujaWrappedModal from './components/PujaWrappedModal';

export default function App() {
  const { language, toggleLanguage, t } = useLanguage();
  const [pandals, setPandals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pandals');
  const [showWrappedModal, setShowWrappedModal] = useState(false);

  // Load Pandals from backend
  const fetchPandals = () => {
    fetch('/api/pandals/')
      .then(res => res.json())
      .then(data => {
        setPandals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching pandals", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPandals();
  }, []);

  const handleSelectPandalFromMap = (pandal) => {
    setActiveTab('pandals');
    // Scroll smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'pandals', label: t('navPandals'), icon: Flame },
    { id: 'heatmap', label: t('navHeatmap'), icon: Map },
    { id: 'itinerary', label: t('navItinerary'), icon: Calendar },
    { id: 'transit', label: t('navTransit'), icon: Train },
    { id: 'amenities', label: t('navAmenities'), icon: Utensils },
    { id: 'bondhu', label: t('navBondhu'), icon: Users },
    { id: 'traffic', label: t('navTraffic'), icon: AlertCircle },
    { id: 'radio', label: t('navRadio'), icon: Radio },
    { id: 'insta', label: t('navInsta'), icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-sindoor-600 selection:text-white">
      {/* Offline Status Pill */}
      <OfflineNotice />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-amber-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pandals')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sindoor-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-sindoor-900/50 border border-amber-400/30">
              🪷
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white font-festive">
                  Sharod<span className="text-amber-400">UTSAV</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-rose-300 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                  KOLKATA 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium font-bengali">
                {language === 'bn' ? 'কলকাতা দুর্গাপুজো লাইভ ইন্টেলিজেন্স প্ল্যাটফর্ম' : 'Crowdsourced Queue Radar & Offline PWA Guide'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
              title="Toggle between English and Bengali"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Puja Wrapped Modal Trigger */}
            <button
              onClick={() => setShowWrappedModal(true)}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs items-center space-x-1.5 shadow-md transition-all"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t('wrappedBtn')}</span>
            </button>

            {/* 1-Tap SOS Header Button */}
            <button
              onClick={() => setActiveTab('bondhu')}
              className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-900/40 border border-rose-400/40 transition-all animate-pulse"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL MODULE NAVIGATION TABS */}
        <div className="bg-slate-900/70 border-t border-slate-800/80 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 py-1.5 text-xs font-semibold">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-sindoor-700 to-amber-600 text-white shadow-md shadow-sindoor-900/30 font-bold border border-amber-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-amber-300">
              Loading live Kolkata crowd intelligence & pandal directory...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'pandals' && (
              <PandalGateNav
                pandals={pandals}
                onQueueReportSuccess={fetchPandals}
              />
            )}

            {activeTab === 'heatmap' && (
              <LiveHeatmap
                pandals={pandals}
                onSelectPandal={handleSelectPandalFromMap}
              />
            )}

            {activeTab === 'itinerary' && (
              <ItineraryPlanner />
            )}

            {activeTab === 'transit' && (
              <TransitGuide />
            )}

            {activeTab === 'amenities' && (
              <AmenitiesRadar />
            )}

            {activeTab === 'bondhu' && (
              <BondhuSOS />
            )}

            {activeTab === 'traffic' && (
              <TrafficSurge />
            )}

            {activeTab === 'radio' && (
              <VintageRadio />
            )}

            {activeTab === 'insta' && (
              <InstaStudio />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-200">SharodUTSAV Platform</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  2nd Year CSE B.Tech Capstone & Hackathon
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Engineered with React 18, Vite PWA, FastAPI, SQLAlchemy ORM, Leaflet Heatmaps & Web Audio API.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-emerald-400 font-semibold">● Offline-First Resilient</span>
              <span className="text-slate-600">|</span>
              <a href="tel:100" className="text-rose-400 hover:underline">Police Control: 100</a>
              <span className="text-slate-600">|</span>
              <a href="tel:1091" className="text-amber-400 hover:underline">Women Safety: 1091</a>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
            <p>© 2026 SharodUTSAV. Dedicated to the spirit of Kolkata Durga Puja (UNESCO Intangible Cultural Heritage).</p>
            <p>Bengali Script: Anek Bangla • Interactive Gate Diagrams: Mermaid.js</p>
          </div>
        </div>
      </footer>

      {/* PUJA WRAPPED MODAL */}
      <PujaWrappedModal
        isOpen={showWrappedModal}
        onClose={() => setShowWrappedModal(false)}
      />
    </div>
  );
}
