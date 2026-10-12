import React, { useState, useEffect, useRef } from 'react';
import { Radio, Volume2, VolumeX, Sparkles, Disc, Power } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VintageRadio() {
  const { language, t } = useLanguage();
  const [isOn, setIsOn] = useState(false);
  const [frequency, setFrequency] = useState(93.6); // MHz
  const [volume, setVolume] = useState(0.8);
  const [currentStation, setCurrentStation] = useState(null);

  // Web Audio Context for authentic white noise static
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const noiseGainRef = useRef(null);
  const audioElementRef = useRef(null);

  const STATIONS = [
    {
      freq: 93.6,
      name: "Akashvani Kolkata (Calcutta-A)",
      show: "Mahisasuramardini (মহিষাসুরমর্দিনী)",
      artist: "Birendra Krishna Bhadra & Pankaj Mullick",
      audio: "https://ia800301.us.archive.org/15/items/MahishasuraMardiniBirendraKrishnaBhadra/01-MahishasuraMardini-Part1.mp3",
      tag: "Iconic 4:00 AM Mahalaya Broadcast"
    },
    {
      freq: 98.3,
      name: "Sharod Dhaak Rhythm",
      show: "Kash Phool & Bol: Grand Dhaaki Beats",
      artist: "Murshidabad Rajbari Dhaakis",
      audio: "https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3",
      tag: "Live Murshidabad Dhaakis"
    },
    {
      freq: 102.5,
      name: "Pujor Gaan Classics",
      show: "Agamani & Golden Era Melodies",
      artist: "Hemanta Mukherjee & Sandhya Mukherjee",
      audio: "https://ia801601.us.archive.org/21/items/BengaliOldSongsCollection/Aha%20Ki%20Anando.mp3",
      tag: "Golden Era Classics"
    }
  ];

  // Initialize Web Audio White Noise Synthesizer
  const initWebAudioNoise = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // 2 seconds buffer of white noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to make it sound like analog radio static
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1.0;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.0;

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      noiseGainRef.current = noiseGain;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  // Adjust audio and static based on tuning closeness
  useEffect(() => {
    if (!isOn) {
      if (noiseGainRef.current) noiseGainRef.current.gain.value = 0;
      if (audioElementRef.current) audioElementRef.current.pause();
      setCurrentStation(null);
      return;
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    // Check tuning distance to nearest station
    let matchedStation = null;
    let minDistance = 999;

    STATIONS.forEach(st => {
      const dist = Math.abs(frequency - st.freq);
      if (dist < minDistance) {
        minDistance = dist;
        if (dist <= 0.6) {
          matchedStation = st;
        }
      }
    });

    if (matchedStation && minDistance <= 0.4) {
      // Clear signal!
      setCurrentStation(matchedStation);
      const signalClarity = Math.max(0, 1 - (minDistance / 0.4));
      
      // Reduce static, increase music
      if (noiseGainRef.current) {
        noiseGainRef.current.gain.value = (1 - signalClarity) * 0.15 * volume;
      }

      if (audioElementRef.current) {
        if (audioElementRef.current.src !== matchedStation.audio) {
          audioElementRef.current.src = matchedStation.audio;
          audioElementRef.current.load();
        }
        audioElementRef.current.volume = signalClarity * volume;
        audioElementRef.current.play().catch(() => {});
      }
    } else {
      // Static hiss
      setCurrentStation(null);
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (noiseGainRef.current) {
        noiseGainRef.current.gain.value = 0.2 * volume;
      }
    }
  }, [isOn, frequency, volume]);

  const handleTogglePower = () => {
    if (!isOn) {
      initWebAudioNoise();
    }
    setIsOn(!isOn);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Radio className="w-6 h-6 text-amber-400" />
            <span>1980s Vintage Murphy Radio Simulator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Nostalgic wooden console, vacuum tube glow, realistic Web Audio analog static physics, and Birendra Krishna Bhadra's Mahalaya recitation.
          </p>
        </div>

        <button
          onClick={handleTogglePower}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg ${
            isOn
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOn ? 'Power OFF' : 'Power ON'}</span>
        </button>
      </div>

      {/* RETRO WOODEN RADIO CHASSIS */}
      <div className="relative max-w-2xl mx-auto bg-gradient-to-b from-[#3a2012] via-[#24140b] to-[#140b06] p-6 rounded-3xl border-4 border-[#5c3317] shadow-2xl space-y-6 text-amber-100">
        {/* Top Trim: Brand Logo & Vacuum Tubes */}
        <div className="flex items-center justify-between border-b border-[#5c3317]/60 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs font-black tracking-widest text-amber-300 uppercase font-serif">
              MURPHY DELUXE • CALCUTTA
            </span>
            <p className="text-[10px] text-amber-400/60 tracking-wider">ALL WAVE VALVE RECEIVER 1982</p>
          </div>

          {/* Glowing Vacuum Tube Indicator */}
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <div className={`w-4 h-7 mx-auto rounded-t-full border border-amber-500/40 transition-all ${
                isOn ? 'bg-amber-500/70 vacuum-tube-glow' : 'bg-slate-800/40'
              }`} />
              <span className="text-[9px] text-amber-400/80 block mt-1">VALVE 1</span>
            </div>
            <div className="text-center">
              <div className={`w-4 h-7 mx-auto rounded-t-full border border-amber-500/40 transition-all ${
                isOn ? 'bg-amber-500/70 vacuum-tube-glow' : 'bg-slate-800/40'
              }`} />
              <span className="text-[9px] text-amber-400/80 block mt-1">VALVE 2</span>
            </div>
          </div>
        </div>

        {/* ANALOG FREQUENCY DIAL SCALE */}
        <div className="bg-[#120a05] p-5 rounded-2xl border-2 border-amber-700/60 shadow-inner relative space-y-3">
          <div className="flex justify-between text-[11px] font-bold text-amber-400/80 tracking-wider font-mono">
            <span>88.0</span>
            <span>92.0</span>
            <span className="text-amber-300">93.6 ★ AKASHVANI</span>
            <span>98.3 ★ DHAAK</span>
            <span>102.5 ★ GAAN</span>
            <span>108.0 MHz</span>
          </div>

          {/* Tuning Slider with Needle */}
          <div className="relative pt-2 pb-1">
            <input
              type="range"
              min="88.0"
              max="108.0"
              step="0.1"
              value={frequency}
              disabled={!isOn}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-amber-950 rounded-lg appearance-none"
            />
            {/* Tuning Glow Bar */}
            <div
              className={`h-0.5 mt-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-opacity ${
                isOn ? 'opacity-80' : 'opacity-0'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-amber-400 font-mono text-sm font-bold">
              {frequency.toFixed(1)} MHz
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
              currentStation
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : isOn
                ? 'bg-amber-950 text-amber-400 border border-amber-600/30'
                : 'text-slate-600'
            }`}>
              {currentStation ? `SIGNAL LOCKED: ${currentStation.name}` : isOn ? 'ANALOG STATIC HISS...' : 'POWER OFF'}
            </span>
          </div>
        </div>

        {/* CURRENT PLAYING DISPLAY */}
        {currentStation && isOn && (
          <div className="bg-amber-950/70 border border-amber-500/40 p-4 rounded-xl space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider">{currentStation.tag}</span>
              <Disc className="w-4 h-4 text-amber-400 animate-spin-slow" />
            </div>
            <h4 className="text-lg font-bold text-white font-serif">{currentStation.show}</h4>
            <p className="text-xs text-amber-200">{currentStation.artist}</p>
          </div>
        )}

        {/* BOTTOM CONTROLS & KNOBS */}
        <div className="grid grid-cols-2 gap-6 pt-2 border-t border-[#5c3317]/60 items-center">
          {/* Quick Station Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">Preset Buttons:</span>
            <div className="flex flex-wrap gap-1.5">
              {STATIONS.map((st, idx) => (
                <button
                  key={idx}
                  disabled={!isOn}
                  onClick={() => setFrequency(st.freq)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    frequency === st.freq
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                      : 'bg-amber-950/60 border-amber-700/50 text-amber-200 hover:bg-amber-900'
                  }`}
                >
                  {st.freq} MHz
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-end space-x-1.5 text-xs text-amber-300">
              <Volume2 className="w-4 h-4" />
              <span>Volume: {Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              disabled={!isOn}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-amber-400 cursor-pointer ml-auto"
            />
          </div>
        </div>

        {/* Hidden Audio Player */}
        <audio ref={audioElementRef} loop />
      </div>
    </div>
  );
}
