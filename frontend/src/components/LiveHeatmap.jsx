import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Eye, Zap, Flame, Shield, Compass, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LiveHeatmap({ pandals = [], onSelectPandal }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const circlesLayerRef = useRef(null);

  const { language, t } = useLanguage();
  const [filterMode, setFilterMode] = useState('all'); // all, low_wait, metro, heritage
  const [userPos, setUserPos] = useState(null);
  const [selectedZone, setSelectedZone] = useState('all');

  // Filter pandals
  const filteredPandals = pandals.filter(p => {
    if (selectedZone !== 'all' && p.zone !== selectedZone) return false;
    if (filterMode === 'low_wait' && p.current_wait_minutes > 35) return false;
    if (filterMode === 'metro' && p.metro_walking_mins > 6) return false;
    if (filterMode === 'heritage' && !p.heritage_status) return false;
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.5626, 88.3639],
        zoom: 12,
        zoomControl: true,
      });

      // CartoDB Dark Matter / OpenStreetMap tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      circlesLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();
    circlesLayerRef.current.clearLayers();

    filteredPandals.forEach(p => {
      // Color logic based on wait minutes
      let markerColor = '#10b981'; // green
      let circleFill = 'rgba(16, 185, 129, 0.2)';
      let pulseRing = 'rgba(16, 185, 129, 0.5)';
      if (p.current_wait_minutes >= 60) {
        markerColor = '#e11d48'; // red
        circleFill = 'rgba(225, 29, 72, 0.25)';
        pulseRing = 'rgba(225, 29, 72, 0.6)';
      } else if (p.current_wait_minutes >= 35) {
        markerColor = '#f59e0b'; // amber
        circleFill = 'rgba(245, 158, 11, 0.25)';
        pulseRing = 'rgba(245, 158, 11, 0.6)';
      }

      // Crowd Heatmap Radius circle
      const radiusMeters = Math.min(800, Math.max(300, p.current_wait_minutes * 12));
      L.circle([p.latitude, p.longitude], {
        color: markerColor,
        fillColor: circleFill,
        fillOpacity: 0.35,
        radius: radiusMeters,
        weight: 1.5,
        dashArray: '3, 6'
      }).addTo(circlesLayerRef.current);

      // Custom Festive Durga / Kalash SVG Pin
      const customIcon = L.divIcon({
        className: 'custom-pandal-marker',
        html: `
          <div style="
            background: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 14px ${markerColor}, 0 2px 6px rgba(0,0,0,0.6);
            border: 2px solid #ffffff;
            cursor: pointer;
          ">
            <span style="transform: rotate(45deg); font-size: 14px; font-weight: bold; color: #fff;">
              🪷
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: Outfit, sans-serif; min-width: 200px; color: #0f172a; padding: 4px;">
          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #881337;">
            ${language === 'bn' ? p.name_bn : p.name_en}
          </h4>
          <p style="margin: 2px 0 6px 0; font-size: 11px; color: #64748b;">
            📍 ${p.landmark}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="
              background: ${p.current_wait_minutes > 50 ? '#ffe4e6' : '#dcfce7'};
              color: ${p.current_wait_minutes > 50 ? '#be123c' : '#15803d'};
              padding: 2px 6px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
            ">
              ⏳ ${p.current_wait_minutes} ${language === 'bn' ? 'মি. লাইন' : 'mins wait'}
            </span>
            <span style="font-size: 10px; color: #475569; font-weight: 600;">
              🚇 ${p.nearest_metro}
            </span>
          </div>
          <button id="view-pandal-${p.id}" style="
            width: 100%;
            background: #9f1239;
            color: #fff;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            ${language === 'bn' ? 'গেট ও ব্যারিকোড দেখুন ➔' : 'View Gates & Barricades ➔'}
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-pandal-${p.id}`);
        if (btn && onSelectPandal) {
          btn.onclick = () => onSelectPandal(p);
        }
      });

      marker.addTo(markersLayerRef.current);
    });

  }, [filteredPandals, language]);

  // Handle Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos([latitude, longitude]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });
          // User beacon marker
          const userIcon = L.divIcon({
            className: 'user-pulse-marker',
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: #3b82f6;
                border: 3px solid #fff;
                border-radius: 50%;
                box-shadow: 0 0 12px #3b82f6;
                animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            `,
            iconSize: [20, 20]
          });
          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup("<b>You are here</b><br>Kolkata Durga Puja GPS Tracked")
            .openPopup();
        }
      },
      (err) => {
        alert("Unable to fetch location: " + err.message);
      }
    );
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-amber-500/20 shadow-2xl bg-slate-950">
      {/* Top Filter Bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-lg">
        {/* Zone Selector */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs py-1">
          {['all', 'North', 'South', 'Central', 'Salt Lake / East', 'Behala'].map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedZone === zone
                  ? 'bg-sindoor-700 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {zone === 'all' ? t('allZones') : zone}
            </button>
          ))}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterMode(filterMode === 'low_wait' ? 'all' : 'low_wait')}
            className={`px-2 py-1 rounded-md flex items-center space-x-1 ${
              filterMode === 'low_wait' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Low Wait (&lt;35m)</span>
          </button>

          <button
            onClick={() => setFilterMode(filterMode === 'metro' ? 'all' : 'metro')}
            className={`px-2 py-1 rounded-md flex items-center space-x-1 ${
              filterMode === 'metro' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Navigation className="w-3 h-3 text-blue-400" />
            <span>&lt;6m Metro</span>
          </button>

          <button
            onClick={handleLocateMe}
            className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-md shadow-md flex items-center space-x-1"
            title="Locate me on map"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Legend Bar */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] flex items-center space-x-3 text-slate-300 shadow-xl">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>&lt; 30m ({t('crowdLow')})</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span>30-60m ({t('crowdMod')})</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-ping"></span>
          <span>60m+ ({t('crowdPacked')})</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-[1000] bg-slate-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-amber-400">
        Showing {filteredPandals.length} Pandals with Live Queue Rings
      </div>
    </div>
  );
}
