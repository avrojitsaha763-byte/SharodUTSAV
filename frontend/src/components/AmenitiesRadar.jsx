import React, { useState, useEffect } from 'react';
import { Utensils, Bath, HeartPulse, ShieldAlert, Star, Accessibility, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AmenitiesRadar() {
  const { language, t } = useLanguage();
  const [amenities, setAmenities] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [allNightOnly, setAllNightOnly] = useState(false);

  useEffect(() => {
    let url = '/api/amenities/';
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.append('category', activeCategory);
    if (wheelchairOnly) params.append('wheelchair_only', 'true');
    if (allNightOnly) params.append('all_night_only', 'true');

    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setAmenities(data))
      .catch(err => console.error("Error loading amenities", err));
  }, [activeCategory, wheelchairOnly, allNightOnly]);

  const categories = [
    { id: 'all', label: 'All Amenities', icon: Star },
    { id: 'washroom', label: 'Swachh Washrooms', icon: Bath },
    { id: 'food', label: 'Iconic Food Radar', icon: Utensils },
    { id: 'medical', label: '24x7 Medical & Trauma', icon: HeartPulse },
    { id: 'police_booth', label: 'Police Assistance Kiosk', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Category Filters */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-xl space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Bath className="w-6 h-6 text-emerald-400" />
            <span>Civic Amenities & Midnight Food Radar</span>
          </h2>
          <p className="text-xs text-slate-400">
            Verified KMC Swachh washrooms, iconic late-night street food joints, and 24/7 medical trauma hubs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setWheelchairOnly(!wheelchairOnly)}
              className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
                wheelchairOnly ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Wheelchair Ramp</span>
            </button>
            <button
              onClick={() => setAllNightOnly(!allNightOnly)}
              className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
                allNightOnly ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>24/7 All-Night</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {amenities.map(am => {
          let details = {};
          try {
            details = JSON.parse(am.details_json || '{}');
          } catch (e) {}

          let categoryIcon = <Star className="w-4 h-4 text-amber-400" />;
          let categoryBadge = 'bg-slate-800 text-slate-300';
          if (am.category === 'washroom') {
            categoryIcon = <Bath className="w-4 h-4 text-emerald-400" />;
            categoryBadge = 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30';
          } else if (am.category === 'food') {
            categoryIcon = <Utensils className="w-4 h-4 text-amber-400" />;
            categoryBadge = 'bg-amber-950/80 text-amber-300 border border-amber-500/30';
          } else if (am.category === 'medical') {
            categoryIcon = <HeartPulse className="w-4 h-4 text-rose-400" />;
            categoryBadge = 'bg-rose-950/80 text-rose-300 border border-rose-500/30';
          } else if (am.category === 'police_booth') {
            categoryIcon = <ShieldAlert className="w-4 h-4 text-blue-400" />;
            categoryBadge = 'bg-blue-950/80 text-blue-300 border border-blue-500/30';
          }

          return (
            <div
              key={am.id}
              className="glass-panel p-5 rounded-2xl border border-slate-700/80 hover:border-amber-500/40 transition-all space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1 ${categoryBadge}`}>
                    {categoryIcon}
                    <span className="capitalize">{am.category.replace('_', ' ')}</span>
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{am.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-100">
                  {language === 'bn' && am.name_bn ? am.name_bn : am.name}
                </h3>

                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>{am.address} ({am.zone})</span>
                </p>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-emerald-400 font-medium">🕒 {am.open_hours}</p>
                  
                  {details.speciality && (
                    <p className="text-amber-300 font-semibold">
                      🍴 Speciality: {details.speciality}
                    </p>
                  )}
                  {details.facilities && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {details.facilities.map((f, fidx) => (
                        <span key={fidx} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded">
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {details.helpline && (
                    <p className="text-rose-400 font-bold">
                      🚨 Helpline: {details.helpline}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                <span>{am.is_wheelchair_accessible ? '♿ Accessible Ramp' : 'Standard Entrance'}</span>
                <span className="text-amber-400 font-semibold">Festive Verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
