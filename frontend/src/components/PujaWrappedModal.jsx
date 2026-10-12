import React from 'react';
import { Award, Footprints, Sparkles, Utensils, Share2, X, Heart, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function PujaWrappedModal({ isOpen, onClose }) {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const handleShare = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (navigator.share) {
      navigator.share({
        title: 'My SharodUTSAV 2026 Puja Wrapped',
        text: 'I completed 19 pandals and walked 26.5 km in Kolkata Durga Puja! Check out your stats on SharodUTSAV.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Wrapped status copied to clipboard! Share on WhatsApp or Instagram.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full bg-gradient-to-b from-slate-950 via-slate-900 to-[#1e1124] rounded-3xl p-6 border-2 border-amber-500/50 shadow-2xl space-y-5 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40">
            FESTIVAL SUMMARY • KOLKATA 2026
          </span>
          <h2 className="text-2xl font-black font-festive text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400 pt-1">
            MY PUJO WRAPPED
          </h2>
          <p className="text-xs text-slate-300">
            Archetype: <strong className="text-amber-400">The Midnight Sabeki Explorer</strong>
          </p>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
            <span className="text-[11px] text-slate-400">{t('pandalsVisited')}</span>
            <p className="text-2xl font-black text-amber-300">19</p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
            <Footprints className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[11px] text-slate-400">{t('kmsWalked')}</span>
            <p className="text-2xl font-black text-emerald-300">26.5 km</p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
            <Utensils className="w-5 h-5 text-rose-400 mx-auto" />
            <span className="text-[11px] text-slate-400">{t('biryaniCount')}</span>
            <p className="text-2xl font-black text-rose-300">6 Pitstops</p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
            <Award className="w-5 h-5 text-blue-400 mx-auto" />
            <span className="text-[11px] text-slate-400">Favorite Pandal</span>
            <p className="text-xs font-bold text-blue-300 mt-2 line-clamp-1">Bagbazar Sarbojanin</p>
          </div>
        </div>

        {/* Highlight Quote */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-center text-xs text-amber-200 italic font-bengali">
          "রাত ৩টের চা, ঢাকের আওয়াজ আর কুড়ি কিলোমিটার হাঁটা... এ পুজো ভোলা যায় না!"
        </div>

        {/* Share Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-gradient-to-r from-sindoor-600 to-amber-600 hover:from-sindoor-500 hover:to-amber-500 text-white font-bold rounded-2xl text-sm shadow-xl flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('shareStatus')}</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            SharodUTSAV • Engineered for CSE B.Tech & Hackathon Excellence
          </p>
        </div>
      </div>
    </div>
  );
}
