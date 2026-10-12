import React, { useState, useEffect } from 'react';
import { Camera, Copy, Check, Sparkles, Image, Compass, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export default function InstaStudio() {
  const { language, t } = useLanguage();
  const [captionsData, setCaptionsData] = useState([]);
  const [guidesData, setGuidesData] = useState([]);
  const [copiedText, setCopiedText] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch('/api/heritage/insta-captions')
      .then(res => res.json())
      .then(data => setCaptionsData(data))
      .catch(err => console.error("Error loading captions", err));

    fetch('/api/heritage/posing-guides')
      .then(res => res.json())
      .then(data => setGuidesData(data))
      .catch(err => console.error("Error loading guides", err));
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-xl space-y-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Camera className="w-6 h-6 text-rose-400" />
          <span>Insta Aesthetic Studio & Bengali Caption Generator</span>
        </h2>
        <p className="text-xs text-slate-400">
          Curated Kolkata pandal photography angles, lighting secrets, and 1-click ready Bengali/Banglish caption copy for your festive feed.
        </p>
      </div>

      {/* POSING & PHOTOGRAPHY GUIDES */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">
          Pandal Photography Composition Angles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guidesData.map((guide, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 transition-all space-y-2.5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-300 bg-rose-950/70 border border-rose-500/30 px-2 py-0.5 rounded">
                  📸 Spot {idx + 1}
                </span>
                <span className="text-[11px] text-amber-400 font-semibold">{guide.location}</span>
              </div>

              <h4 className="font-bold text-sm text-slate-100">{guide.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{guide.tip}</p>

              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px] text-amber-300 font-medium">
                🎯 Angle: {guide.angle}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAPTION DIRECTORY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">
            Bilingual Bengali, Banglish & English Captions
          </h3>
        </div>

        <div className="space-y-6">
          {captionsData.map((cat, cidx) => (
            <div key={cidx} className="space-y-3">
              <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{cat.category}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.captions.map((cap, capIdx) => {
                  const isCopied = copiedText === cap.text;
                  return (
                    <div
                      key={capIdx}
                      className="glass-panel p-4 rounded-2xl border border-slate-700 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 shadow-md"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                          {cap.language}
                        </span>
                        <p className="text-xs text-slate-100 leading-relaxed font-bengali">
                          {cap.text}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(cap.text)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                          isCopied
                            ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied to Clipboard!' : t('copyCaption')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
