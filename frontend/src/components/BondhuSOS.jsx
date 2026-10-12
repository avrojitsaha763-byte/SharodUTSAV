import React, { useState } from 'react';
import { 
  Users, AlertTriangle, PhoneCall, Shield, MapPin, 
  Compass, Radio, Volume2, VolumeX, ExternalLink, Plus, Trash2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BondhuSOS() {
  const { language, t } = useLanguage();
  
  // Friends midpoint state
  const [friends, setFriends] = useState([
    { name: 'Rohan (Dum Dum)', latitude: 22.6214, longitude: 88.3934 },
    { name: 'Sneha (Garia)', latitude: 22.4645, longitude: 88.3842 },
    { name: 'Anik (Howrah)', latitude: 22.5830, longitude: 88.3426 },
  ]);
  const [newFriendName, setNewFriendName] = useState('');
  const [midpointResult, setMidpointResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // SOS Emergency Strobe Mode
  const [strobeActive, setStrobeActive] = useState(false);

  const KOLKATA_HUBS = {
    "Dum Dum": { lat: 22.6214, lon: 88.3934 },
    "Shyambazar": { lat: 22.6006, lon: 88.3705 },
    "Howrah Station": { lat: 22.5830, lon: 88.3426 },
    "Sealdah": { lat: 22.5670, lon: 88.3712 },
    "Esplanade (Central)": { lat: 22.5647, lon: 88.3518 },
    "Park Street": { lat: 22.5532, lon: 88.3533 },
    "Kalighat": { lat: 22.5190, lon: 88.3470 },
    "Gariahat": { lat: 22.5186, lon: 88.3678 },
    "Garia (Kavi Subhash)": { lat: 22.4645, lon: 88.3842 },
    "Salt Lake Karunamoyee": { lat: 22.5850, lon: 88.4110 },
    "Behala Chowrasta": { lat: 22.4978, lon: 88.3156 }
  };

  const [selectedHub, setSelectedHub] = useState('Esplanade (Central)');

  const handleAddFriend = () => {
    if (!newFriendName.trim()) return;
    const coords = KOLKATA_HUBS[selectedHub] || { lat: 22.5647, lon: 88.3518 };
    setFriends([...friends, {
      name: `${newFriendName.trim()} (${selectedHub})`,
      latitude: coords.lat,
      longitude: coords.lon
    }]);
    setNewFriendName('');
  };

  const handleRemoveFriend = (index) => {
    setFriends(friends.filter((_, i) => i !== index));
  };

  const handleCalculateMidpoint = async () => {
    setCalculating(true);
    try {
      const res = await fetch('/api/groups/midpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friends })
      });
      if (res.ok) {
        const data = await res.json();
        setMidpointResult(data);
      }
    } catch (err) {
      console.error("Error calculating midpoint", err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HIGH VISIBILITY STROBE MODAL */}
      {strobeActive && (
        <div className="fixed inset-0 z-[9999] emergency-strobe-bg flex flex-col items-center justify-center p-6 text-white text-center select-none">
          <div className="max-w-md w-full bg-black/90 p-8 rounded-3xl border-4 border-rose-500 shadow-2xl space-y-6 animate-pulse">
            <AlertTriangle className="w-20 h-20 text-rose-500 mx-auto animate-bounce" />
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-rose-500 tracking-wider">
                EMERGENCY SOS BEACON
              </h1>
              <p className="text-sm font-bold text-slate-200">
                Show this high-contrast pulsating screen to nearby Kolkata Police officers or volunteers.
              </p>
            </div>

            {/* Direct Dial 100 Action */}
            <div className="space-y-3 pt-2">
              <a
                href="tel:100"
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xl rounded-2xl shadow-xl flex items-center justify-center space-x-3 transition-transform active:scale-95"
              >
                <PhoneCall className="w-7 h-7" />
                <span>DIAL 100 IMMEDIATELY</span>
              </a>

              <a
                href="https://kolkatapolice.gov.in/bondhu/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 border border-slate-600"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Kolkata Police Bondhu Portal</span>
              </a>
            </div>

            <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
              <p>Women Helpline: <strong>1091</strong> • Ambulance: <strong>102</strong></p>
              <p>Childline: <strong>1098</strong> • Traffic Control: <strong>1073</strong></p>
            </div>

            <button
              onClick={() => setStrobeActive(false)}
              className="w-full py-2.5 bg-slate-700 text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-600"
            >
              Dismiss Emergency Alarm
            </button>
          </div>
        </div>
      )}

      {/* SOS Quick Bar */}
      <div className="glass-panel-crimson p-6 rounded-2xl border border-rose-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <Shield className="w-5 h-5 text-rose-400 animate-pulse" />
            <span>KOLKATA POLICE EMERGENCY SAFETY BEACON</span>
          </div>
          <p className="text-xs text-slate-200 max-w-xl">
            Partitioned citizen safety hub. Directly dials Kolkata Police Control Room (100) or activates high-visibility night strobe for crowd separation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setStrobeActive(true)}
            className="px-5 py-3 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-black text-sm rounded-xl shadow-lg shadow-rose-900/50 flex items-center space-x-2 border border-rose-400/40 active:scale-95 transition-all"
          >
            <AlertTriangle className="w-5 h-5" />
            <span>TRIGGER SOS STROBE</span>
          </button>

          <a
            href="tel:100"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center space-x-2 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL 100</span>
          </a>
        </div>
      </div>

      {/* BONDHU MIDPOINT FINDER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Friend Locations Input */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-slate-100">
              {language === 'bn' ? 'বন্ধু ফাইন্ডার: মিলনকেন্দ্র নির্ণয়' : 'Bondhu Finder: Group Midpoint Engine'}
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Separated across Kolkata's massive festive rush? Enter your friends' locations to compute the fairest central Metro meeting hub.
          </p>

          {/* Friends List */}
          <div className="space-y-2">
            {friends.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-200"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="font-semibold">{f.name}</span>
                </div>
                {friends.length > 2 && (
                  <button
                    onClick={() => handleRemoveFriend(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Friend Input with Station Hub */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Friend's Name (e.g. Arka)"
                className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              >
                {Object.keys(KOLKATA_HUBS).map(hub => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddFriend}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs border border-slate-700 flex items-center justify-center space-x-1"
            >
              <span>+ Add Friend to Meeting Group</span>
            </button>
          </div>

          <button
            onClick={handleCalculateMidpoint}
            disabled={calculating}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>{calculating ? 'Calculating Centroid Hub...' : t('findMidpoint')}</span>
          </button>
        </div>

        {/* Right: Recommended Hub Result */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-slate-100">
                {language === 'bn' ? 'সুপারিশকৃত কেন্দ্রীয় মিলনস্থল' : 'Recommended Rendezvous Hub'}
              </h3>
            </div>

            {midpointResult ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Optimal Meeting Point</span>
                  <h4 className="text-lg font-bold text-emerald-200">
                    {midpointResult.recommended_hub_name}
                  </h4>
                  <p className="text-xs text-slate-300">
                    🚇 {midpointResult.hub_metro_line}
                  </p>
                  <p className="text-xs text-amber-300 font-semibold">
                    📍 Landmark: {midpointResult.meeting_landmark}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Average Travel:</span>
                    <p className="text-base font-bold text-blue-400 mt-0.5">
                      ~{midpointResult.average_travel_time_mins} Mins
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Nearest Police Station:</span>
                    <p className="text-xs font-bold text-slate-200 mt-1">
                      {midpointResult.emergency_police_station}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-300">Nearby Pandals to Explore Together:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {midpointResult.nearby_pandals.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700"
                      >
                        🪷 {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Click "Find Friends' Central Hub" to calculate the closest transit intersection.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
            Calculated using weighted geographic centroid algorithms + Kolkata Metro interchange matrix.
          </div>
        </div>
      </div>
    </div>
  );
}
