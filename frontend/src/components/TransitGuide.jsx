import React, { useState, useEffect } from 'react';
import { Train, Car, Bus, MapPin, Shield, Clock, Compass, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TransitGuide() {
  const { language, t } = useLanguage();
  const [stations, setStations] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [nightBuses, setNightBuses] = useState([]);
  const [activeTab, setActiveTab] = useState('metro'); // metro, parking, buses
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetch('/api/transit/stations')
      .then(res => res.json())
      .then(data => {
        setStations(data);
        if (data.length > 0) setSelectedStation(data[0]);
      })
      .catch(err => console.error("Error loading stations", err));

    fetch('/api/transit/parking')
      .then(res => res.json())
      .then(data => setParkingLots(data))
      .catch(err => console.error("Error loading parking", err));

    fetch('/api/transit/night-buses')
      .then(res => res.json())
      .then(data => setNightBuses(data))
      .catch(err => console.error("Error loading night buses", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Train className="w-6 h-6 text-blue-400" />
            <span>Kolkata Transit & Police Parking Guide</span>
          </h2>
          <p className="text-xs text-slate-400">
            Official exit gates, night metro timings, police-supervised parking and WBTC special night buses.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('metro')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'metro' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Metro Exit Gates</span>
          </button>
          <button
            onClick={() => setActiveTab('parking')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'parking' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Police Parking</span>
          </button>
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
              activeTab === 'buses' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>All-Night Buses</span>
          </button>
        </div>
      </div>

      {/* METRO TAB CONTENT */}
      {activeTab === 'metro' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Station Selector Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider px-1">Major Metro Hubs</h3>
            {stations.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs ${
                  selectedStation?.id === st.id
                    ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-md font-bold'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-100">{st.station_name}</p>
                  <span className="text-[11px] text-slate-400">{st.line_name}</span>
                </div>
                <span className="text-blue-400 font-bold">➔</span>
              </button>
            ))}
          </div>

          {/* Station Gate Details */}
          <div className="md:col-span-2 space-y-4">
            {selectedStation && (
              <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{selectedStation.station_name} Metro Station</h3>
                    <p className="text-xs text-blue-400 font-medium">{selectedStation.line_name}</p>
                  </div>
                  <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    Runs till 4:00 AM on Puja Nights
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Exit Gates & Connecting Pandals Guide:
                  </h4>
                  {JSON.parse(selectedStation.exit_gates_json || '[]').map((g, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          {g.gate}
                        </span>
                        <span className="text-xs text-emerald-400 font-semibold">
                          ⏱️ ~{g.walking_mins} mins walk
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium">
                        Direction: <span className="text-slate-300">{g.direction}</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {g.nearby_pandals.map((np, nidx) => (
                          <span
                            key={nidx}
                            className="bg-slate-800 text-slate-300 text-[11px] px-2 py-0.5 rounded-md border border-slate-700"
                          >
                            🪷 {np}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PARKING TAB CONTENT */}
      {activeTab === 'parking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parkingLots.map((lot, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/30">
                  {lot.station_area} Zone
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  ₹{lot.rate_hourly}/hr
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-100">{lot.location}</h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p>Vehicle Type: <strong className="text-slate-200">{lot.type}</strong></p>
                <p>Capacity: <strong className="text-blue-400">{lot.capacity} Bays</strong></p>
                <p>Distance to Mandap: <strong className="text-amber-300">{lot.dist_to_pandal}</strong></p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center space-x-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Kolkata Police CCTV Supervised Lot</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NIGHT BUSES TAB CONTENT */}
      {activeTab === 'buses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nightBuses.map((bus, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  🚌 {bus.route}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Hub / Corridor: <strong className="text-slate-100">{bus.hub}</strong>
              </p>
              <div className="bg-slate-900/80 p-2 rounded-lg text-xs space-y-1 border border-slate-800">
                <p className="text-amber-300 font-medium">Frequency: {bus.frequency}</p>
                {bus.stop && <p className="text-slate-400 text-[11px]">Key Stop: {bus.stop}</p>}
              </div>
              <p className="text-[10px] text-emerald-400/90 font-medium">
                WBTC Puja Special • Operates dusk till dawn
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
