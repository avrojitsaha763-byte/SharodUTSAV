import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Car, Bike, Train, Zap, ShieldAlert, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TrafficSurge() {
  const { language, t } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [surgeData, setSurgeData] = useState(null);
  
  // Fare estimator state
  const [estimateKm, setEstimateKm] = useState(8);
  const [estimateMode, setEstimateMode] = useState('cab');
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    fetch('/api/traffic/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Error loading traffic alerts", err));

    fetch('/api/traffic/surge-matrix')
      .then(res => res.json())
      .then(data => setSurgeData(data))
      .catch(err => console.error("Error loading surge data", err));
  }, []);

  const handleEstimateFare = async () => {
    try {
      const res = await fetch(`/api/traffic/estimate-fare?distance_km=${estimateKm}&mode=${estimateMode}`);
      if (res.ok) {
        const data = await res.json();
        setFareEstimate(data);
      }
    } catch (err) {
      console.error("Error calculating fare", err);
    }
  };

  useEffect(() => {
    handleEstimateFare();
  }, [estimateKm, estimateMode]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-xl space-y-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-amber-400" />
          <span>Kolkata Police Traffic Diversions & Transport Surge</span>
        </h2>
        <p className="text-xs text-slate-400">
          Official traffic management rules, one-way vehicular diversions and indicative festive fare surge indices.
        </p>
      </div>

      {/* POLICE DIVERSION ALERTS */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">
          Active Kolkata Police Road Diversions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map(alert => {
            let badgeBg = 'bg-amber-950/80 border-amber-500/40 text-amber-300';
            if (alert.severity === 'danger') {
              badgeBg = 'bg-rose-950/80 border-rose-500/40 text-rose-300';
            } else if (alert.severity === 'info') {
              badgeBg = 'bg-blue-950/80 border-blue-500/40 text-blue-300';
            }

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border backdrop-blur-md space-y-2.5 ${badgeBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40">
                    {alert.restriction_type}
                  </span>
                  <span className="text-[11px] font-semibold">
                    ⏰ {alert.active_from} - {alert.active_until}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-100">
                  {alert.road_name}
                </h4>

                <p className="text-xs leading-relaxed text-slate-200">
                  {language === 'bn' ? alert.description_bn : alert.description_en}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SURGE MATRIX TABLE */}
      {surgeData && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-slate-100">
                Indicative Festive Fare Surge Matrix ({surgeData.current_period})
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded">
              Updated for Peak Puja Timing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Uber / Cab */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center space-x-1">
                  <Car className="w-4 h-4 text-rose-400" />
                  <span>Uber / Ola Cab</span>
                </span>
                <span className="bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded font-bold">
                  {surgeData.aggregators.uber_ola_cab.multiplier}x Surge
                </span>
              </div>
              <p className="text-slate-400">{surgeData.aggregators.uber_ola_cab.advice}</p>
            </div>

            {/* Bike Moto */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center space-x-1">
                  <Bike className="w-4 h-4 text-amber-400" />
                  <span>Bike / Moto</span>
                </span>
                <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded font-bold">
                  {surgeData.aggregators.bike_moto.multiplier}x Surge
                </span>
              </div>
              <p className="text-slate-400">{surgeData.aggregators.bike_moto.advice}</p>
            </div>

            {/* Kolkata Metro */}
            <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-200 flex items-center space-x-1">
                  <Train className="w-4 h-4 text-emerald-400" />
                  <span>Kolkata Metro</span>
                </span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  0x Surge (Flat ₹10-25)
                </span>
              </div>
              <p className="text-slate-300">{surgeData.aggregators.kolkata_metro.highlight}</p>
            </div>
          </div>
        </div>
      )}

      {/* FARE ESTIMATOR CALCULATOR */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-4">
        <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-amber-400" />
          <span>Interactive Festive Fare Calculator</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Transit Mode:</label>
            <select
              value={estimateMode}
              onChange={(e) => setEstimateMode(e.target.value)}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="cab">🚗 4-Wheeler Cab (Uber / Ola)</option>
              <option value="bike">🛵 2-Wheeler Moto</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-300">Distance (km):</label>
              <span className="text-amber-400 font-bold">{estimateKm} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="35"
              step="1"
              value={estimateKm}
              onChange={(e) => setEstimateKm(e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center">
            <span className="text-[11px] text-slate-400">Estimated Festive Fare:</span>
            <p className="text-xl font-black text-amber-400">
              {fareEstimate ? fareEstimate.estimated_range : 'Calculating...'}
            </p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center">
          *Indicative festive estimate only. Actual aggregator fares may vary based on rain and local pandal diversions.
        </p>
      </div>
    </div>
  );
}
