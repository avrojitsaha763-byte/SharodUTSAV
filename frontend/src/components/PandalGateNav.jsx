import React, { useState } from 'react';
import { 
  Search, Clock, MapPin, Subtitles, Heart, Shield, 
  GitBranch, Users, ThumbsUp, CheckCircle2, AlertCircle, 
  Sparkles, Accessibility, Award, Flame, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import MermaidViewer from './MermaidViewer';

export default function PandalGateNav({ pandals = [], onQueueReportSuccess }) {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [activePandalForGates, setActivePandalForGates] = useState(null);
  const [activeGateType, setActiveGateType] = useState('general'); // general, vip, senior_citizen
  
  // Modal for reporting wait time
  const [reportingPandal, setReportingPandal] = useState(null);
  const [reportWaitMinutes, setReportWaitMinutes] = useState(30);
  const [reportCrowdLevel, setReportCrowdLevel] = useState('moderate');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // Visited pandals tracking for Puja Wrapped
  const [visitedIds, setVisitedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sharod_visited_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Dynamic gate diagrams cache from backend
  const [gatesCache, setGatesCache] = useState({});

  const toggleVisited = (pandalId) => {
    const next = new Set(visitedIds);
    if (next.has(pandalId)) {
      next.delete(pandalId);
    } else {
      next.add(pandalId);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
    setVisitedIds(next);
    localStorage.setItem('sharod_visited_ids', JSON.stringify([...next]));
  };

  const handleToggleGates = async (pandal) => {
    if (activePandalForGates?.id === pandal.id) {
      setActivePandalForGates(null);
      return;
    }
    setActivePandalForGates(pandal);
    if (!gatesCache[pandal.id]) {
      try {
        const res = await fetch(`/api/pandals/${pandal.id}`);
        if (res.ok) {
          const detail = await res.json();
          if (detail.gates) {
            setGatesCache(prev => ({ ...prev, [pandal.id]: detail.gates }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch gate detail", err);
      }
    }
  };

  const handleUpvote = async (pandalId) => {
    if (upvotedIds.has(pandalId)) return;
    try {
      await fetch(`/api/pandals/${pandalId}/upvote`, { method: 'POST' });
      setUpvotedIds(prev => new Set([...prev, pandalId]));
    } catch (e) {
      console.error("Upvote failed", e);
    }
  };

  const handleOpenReportModal = (pandal) => {
    setReportingPandal(pandal);
    setReportWaitMinutes(pandal.current_wait_minutes || 30);
    setReportCrowdLevel(pandal.crowd_level || 'moderate');
    setReportSubmittedSuccess(false);
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportingPandal) return;
    setReportSubmitting(true);
    try {
      const res = await fetch(`/api/pandals/${reportingPandal.id}/report-queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wait_minutes: parseInt(reportWaitMinutes, 10),
          crowd_level: reportCrowdLevel,
          visitor_tag: "Verified On-Ground Visitor"
        })
      });
      if (res.ok) {
        setReportSubmittedSuccess(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
        if (onQueueReportSuccess) onQueueReportSuccess();
        setTimeout(() => {
          setReportingPandal(null);
          setReportSubmittedSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to submit queue report", err);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Zone Navigation Filter */}
      <div className="glass-panel p-4 rounded-2xl space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-amber-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Zone Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: t('allZones') },
            { id: 'North', label: t('northZone') },
            { id: 'South', label: t('southZone') },
            { id: 'Central', label: t('centralZone') },
            { id: 'Salt Lake / East', label: t('saltLakeZone') },
            { id: 'Behala', label: t('behalaZone') },
          ].map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedZone === z.id
                  ? 'bg-gradient-to-r from-sindoor-700 to-sindoor-600 text-white shadow-md shadow-sindoor-900/40 border border-sindoor-400/30'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pandals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPandals.map(pandal => {
          const isSelectedForGates = activePandalForGates?.id === pandal.id;
          const waitMins = pandal.current_wait_minutes;
          
          let waitBadgeColor = 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
          if (waitMins >= 65) {
            waitBadgeColor = 'bg-rose-950/80 border-rose-500/40 text-rose-300 animate-pulse';
          } else if (waitMins >= 35) {
            waitBadgeColor = 'bg-amber-950/80 border-amber-500/40 text-amber-300';
          }

          return (
            <div
              key={pandal.id}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-700/70 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Image Banner & Overlay Badges */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={pandal.image_url || "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"}
                    alt={pandal.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Zone Tag */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                    {pandal.zone}
                  </span>

                  {/* Heritage or Accessible Badges */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {pandal.heritage_status && (
                      <span className="bg-amber-600/90 text-slate-950 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>Sabeki</span>
                      </span>
                    )}
                    {pandal.wheelchair_accessible && (
                      <span className="bg-blue-600/80 text-white p-1 rounded-md text-[10px]" title="Wheelchair Ramp">
                        <Accessibility className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Live Wait Pill at bottom of banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md flex items-center space-x-1.5 ${waitBadgeColor}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{waitMins} {t('waitMins')}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => toggleVisited(pandal.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border flex items-center space-x-1 transition-all ${
                          visitedIds.has(pandal.id)
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                        title="Mark visited for Puja Wrapped stats"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{visitedIds.has(pandal.id) ? 'Visited' : 'Check In'}</span>
                      </button>

                      <button
                        onClick={() => handleUpvote(pandal.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md border flex items-center space-x-1 transition-all ${
                          upvotedIds.has(pandal.id)
                            ? 'bg-sindoor-600 border-sindoor-400 text-white'
                            : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{pandal.upvotes + (upvotedIds.has(pandal.id) ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                      {language === 'bn' ? pandal.name_bn : pandal.name_en}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {language === 'bn' ? pandal.name_en : pandal.name_bn}
                    </p>
                  </div>

                  {pandal.theme_2026 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-start space-x-1.5 text-xs text-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1 italic">
                        {pandal.theme_2026}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-xs text-slate-300 space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="line-clamp-1">{pandal.landmark}</span>
                  </div>

                  {/* Metro Connection */}
                  <div className="bg-slate-900/60 p-2 rounded-xl text-xs flex items-center justify-between text-slate-300 border border-slate-800">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-blue-400 font-bold">🚇 {pandal.nearest_metro}</span>
                    </div>
                    <span className="text-[11px] text-amber-400/90 font-semibold bg-amber-950/60 px-2 py-0.5 rounded">
                      {pandal.metro_exit_gate} ({pandal.metro_walking_mins}m walk)
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {language === 'bn' ? pandal.description_bn : pandal.description_en}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleGates(pandal)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                      isSelectedForGates
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-800/80 text-amber-300 border-amber-500/30 hover:bg-slate-800'
                    }`}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>{isSelectedForGates ? 'Hide Gates' : t('viewGateFlow')}</span>
                  </button>

                  <button
                    onClick={() => handleOpenReportModal(pandal)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-sindoor-900/70 hover:bg-sindoor-800 text-rose-200 border border-sindoor-600/40 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t('reportWaitBtn')}</span>
                  </button>
                </div>

                {/* Gate Flowchart Expanded Section */}
                {isSelectedForGates && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="font-semibold text-slate-300">Select Gate Channel:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setActiveGateType('general')}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            activeGateType === 'general' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          General
                        </button>
                        <button
                          onClick={() => setActiveGateType('vip')}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            activeGateType === 'vip' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          VIP Pass
                        </button>
                        <button
                          onClick={() => setActiveGateType('senior_citizen')}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            activeGateType === 'senior_citizen' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Senior Ramp
                        </button>
                      </div>
                    </div>

                    {/* Mermaid Viewer rendering dynamic backend or fallback flowchart */}
                    {(() => {
                      const cachedGates = gatesCache[pandal.id] || pandal.gates || [];
                      const matchedGate = cachedGates.find(g => g.gate_type === activeGateType);
                      const chartCode = matchedGate?.mermaid_flow || (
                        activeGateType === 'vip'
                          ? `graph LR\n  A[VIP Pass Checkpoint] --> B[Fast-Track Red Carpet]\n  B --> C[Inner Sanctum Deck]\n  C --> D[Priority Exit Gate]`
                          : activeGateType === 'senior_citizen'
                          ? `graph LR\n  A[Accessible Ramp Entry] --> B[Wheelchair Escort Lane]\n  B --> C[Ground-Level Darshan]\n  C --> D[Step-Free Exit]`
                          : `graph LR\n  A[Main Barricade Hold] --> B[Metal Detector Scan]\n  B --> C[Serpentine Zig-Zag]\n  C --> D[Main Mandap Darshan]\n  D --> E[Radial Exit Stream]`
                      );
                      return (
                        <MermaidViewer
                          chart={chartCode}
                          title={`${language === 'bn' ? pandal.name_bn : pandal.name_en} • ${(matchedGate?.gate_name || activeGateType).toUpperCase()}`}
                        />
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crowdsourced Wait Time Modal */}
      {reportingPandal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-amber-500/30 shadow-2xl relative space-y-4">
            <button
              onClick={() => setReportingPandal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Crowdsource Queue Update</span>
              <h3 className="text-xl font-bold text-slate-100">
                {language === 'bn' ? reportingPandal.name_bn : reportingPandal.name_en}
              </h3>
              <p className="text-xs text-slate-400">
                Help fellow pandal hoppers navigate real-time Kolkata crowds!
              </p>
            </div>

            {reportSubmittedSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-center space-y-2 text-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold">Wait Time Reported Successfully!</h4>
                <p className="text-xs">Your update has been verified and incorporated into the live queue engine.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-200">Estimated Current Wait Time:</label>
                    <span className="text-amber-400 font-bold text-sm">{reportWaitMinutes} Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={reportWaitMinutes}
                    onChange={(e) => setReportWaitMinutes(e.target.value)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>5m (Breeze)</span>
                    <span>45m (Moderate)</span>
                    <span>90m (Crowded)</span>
                    <span>180m (Extreme)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-200">Observed Crowd Level:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'low', label: '🟢 Low / Smooth (<25m)' },
                      { id: 'moderate', label: '🟡 Moderate (25-50m)' },
                      { id: 'heavy', label: '🟠 Heavy Rush (50-80m)' },
                      { id: 'packed', label: '🔴 Packed / Stalled (80m+)' },
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setReportCrowdLevel(opt.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          reportCrowdLevel === opt.id
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-sindoor-600 to-amber-600 hover:from-sindoor-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{reportSubmitting ? 'Verifying & Broadcasting...' : 'Broadcast Queue Update'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    Submissions are verified with time-decay algorithms to prevent spoofing.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
