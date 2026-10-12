import React, { useState } from 'react';
import { 
  Calendar, Clock, Footprints, Train, Navigation, 
  MapPin, CheckCircle, ArrowRight, Download, Sparkles, AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ItineraryPlanner() {
  const { language, t } = useLanguage();
  const [origin, setOrigin] = useState('Dum Dum');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('23:30');
  const [mode, setMode] = useState('metro_walk');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [savedOffline, setSavedOffline] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setSavedOffline(false);
    try {
      const res = await fetch('/api/itinerary/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          start_time: startTime,
          end_time: endTime,
          mode
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (err) {
      console.error("Itinerary optimization failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToOffline = () => {
    if (!plan) return;
    localStorage.setItem('sharod_offline_itinerary', JSON.stringify(plan));
    setSavedOffline(true);
    setTimeout(() => setSavedOffline(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Parameter Selection Card */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <Calendar className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {language === 'bn' ? 'স্মার্ট পুজো পরিক্রমা পরিকল্পক' : 'Smart Parikrama Route Optimizer'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn' 
                ? 'ভিড় ও জ্যাম এড়িয়ে সেরা সময়ে একাধিক সেরা মণ্ডপ দর্শনের স্বয়ংক্রিয় রুট' 
                : 'Algorithmic proximity routing factoring real-time queue decay & Metro exit corridors'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Origin */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('originSelect')}</span>
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="Dum Dum">Dum Dum (North Hub)</option>
              <option value="Shyambazar">Shyambazar 5-Point</option>
              <option value="Howrah">Howrah Station Terminal</option>
              <option value="Sealdah">Sealdah Station</option>
              <option value="Esplanade">Esplanade Central</option>
              <option value="Kalighat">Kalighat (South Core)</option>
              <option value="Gariahat">Gariahat Crossing</option>
              <option value="Garia">Garia / Kavi Subhash</option>
              <option value="Salt Lake">Salt Lake Karunamoyee</option>
              <option value="Behala">Behala Chowrasta</option>
            </select>
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Start Time (Departure)</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Target End Time</span>
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Mode */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1">
              <Train className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('transitMode')}</span>
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400 text-xs"
            >
              <option value="metro_walk">🚇 Metro Rail + Walk (Recommended)</option>
              <option value="two_wheeler">🛵 Two-Wheeler / Bike</option>
              <option value="car">🚗 Car / App Cab</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-sindoor-600 via-amber-600 to-sindoor-700 hover:from-sindoor-500 hover:to-amber-500 text-white font-bold rounded-xl text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? 'Optimizing Non-Backtracking Route...' : t('planTripBtn')}</span>
        </button>
      </div>

      {/* Generated Itinerary Display */}
      {plan && (
        <div className="space-y-5 animate-fadeIn">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="glass-panel p-3.5 rounded-xl border-amber-500/20">
              <span className="text-xs text-slate-400">Total Pandals</span>
              <p className="text-xl font-bold text-amber-400">{plan.total_pandals} Pandals</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border-amber-500/20">
              <span className="text-xs text-slate-400">Total Duration</span>
              <p className="text-xl font-bold text-emerald-400">{plan.total_duration_hours} Hours</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border-amber-500/20">
              <span className="text-xs text-slate-400">{t('walkingDistance')}</span>
              <p className="text-xl font-bold text-blue-400">{plan.total_walking_km} km</p>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border-amber-500/20">
              <span className="text-xs text-slate-400">Crowd Index</span>
              <p className="text-xs font-bold text-amber-300 mt-1">{plan.estimated_crowd_index}</p>
            </div>
          </div>

          {/* Offline Save Action */}
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <Train className="w-4 h-4 text-amber-400" />
              <span>Recommended Transit: <strong className="text-amber-300">{plan.recommended_metro_pass}</strong></span>
            </div>
            <button
              onClick={handleSaveToOffline}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{savedOffline ? 'Saved to Offline Storage!' : 'Save Route to Offline PWA'}</span>
            </button>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-sindoor-500 before:to-emerald-400">
            {plan.steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start space-x-4 pl-2">
                {/* Step Circle Badge */}
                <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-sindoor-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow-md">
                  {step.step_number}
                </div>

                {/* Step Card Content */}
                <div className="glass-panel flex-1 p-4 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 transition-all space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-base text-slate-100">
                        {language === 'bn' ? step.pandal_name_bn : step.pandal_name_en}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {language === 'bn' ? step.pandal_name_en : step.pandal_name_bn}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                        Arrive: {step.arrival_time}
                      </span>
                      <span className="text-slate-500">➔</span>
                      <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold">
                        Depart: {step.departure_time}
                      </span>
                    </div>
                  </div>

                  {/* Timing Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-400">Expected Queue:</span>{' '}
                      <strong className="text-amber-400">{step.wait_time_mins} mins</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Sanctum Viewing:</span>{' '}
                      <strong className="text-emerald-400">{step.estimated_stay_mins} mins</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Transit Leg:</span>{' '}
                      <strong className="text-blue-400">{step.transit_duration_mins} mins</strong>
                    </div>
                  </div>

                  {/* Turn-by-Turn Transit Instruction */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl text-xs text-slate-300 border border-slate-800 flex items-start space-x-2">
                    <Navigation className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{step.transit_instruction}</p>
                      <span className="text-[10px] text-blue-400 font-semibold">
                        Metro Station: {step.metro_station} • Exit Gate: {step.metro_gate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
