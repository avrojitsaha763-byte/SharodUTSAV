import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    appTitle: "SharodUTSAV",
    appSubtitle: "Kolkata Durga Puja Intelligence & Companion",
    liveStatus: "Live Festive Traffic Active",
    navPandals: "Pandals & Gates",
    navHeatmap: "Crowd Radar",
    navItinerary: "Parikrama Route",
    navTransit: "Metro & Parking",
    navAmenities: "Washrooms & Food",
    navBondhu: "Bondhu & SOS",
    navTraffic: "Police Diversions",
    navRadio: "1980s Radio",
    navInsta: "Insta Studio",
    navWrapped: "Pujo Wrapped",
    searchPlaceholder: "Search 35+ pandals by name, landmark, theme...",
    allZones: "All Zones",
    northZone: "North Kolkata",
    southZone: "South Kolkata",
    centralZone: "Central Kolkata",
    saltLakeZone: "Salt Lake & East",
    behalaZone: "Behala & West",
    waitMins: "min wait",
    reportWaitBtn: "Report Queue",
    viewGateFlow: "Gate Flowchart",
    nearMetro: "Nearest Metro",
    exitGate: "Exit Gate",
    heritageTag: "Heritage Puja",
    accessibleTag: "Wheelchair Ramp",
    vipPass: "VIP Lane Active",
    crowdLow: "Smooth (< 25m)",
    crowdMod: "Moderate (25-50m)",
    crowdHeavy: "Heavy (50-80m)",
    crowdPacked: "Packed (80m+)",
    updatedAgo: "Verified queue update",
    emergencySosBtn: "EMERGENCY SOS",
    dial100Notice: "Instant 1-Tap Dial 100 / Kolkata Police Headquarters",
    strobeActive: "HIGH-VISIBILITY STROBE ALARM TRIGGERED",
    stopStrobe: "Dismiss Alarm",
    offlineBanner: "You are currently offline. Cached pandal guides and emergency contacts remain 100% active.",
    onlineBanner: "Connected to live Kolkata crowd intelligence network.",
    planTripBtn: "Generate Optimized Parikrama Route",
    originSelect: "Your Starting Point",
    timeWindow: "Visiting Window",
    transitMode: "Mode of Travel",
    walkingDistance: "Total Walking",
    crowdForecast: "Crowd Forecast",
    findMidpoint: "Find Friends' Central Hub",
    addFriend: "+ Add Friend's Location",
    recommendedHub: "Recommended Meeting Junction",
    averageTravelTime: "Avg travel time",
    tuneRadio: "Rotate Tuning Dial",
    radioTuned: "Signal Tuned: 93.6 MHz Akashvani Kolkata",
    radioStatic: "Frequency Tuning Static...",
    copyCaption: "Copy Caption",
    copiedToast: "Copied to clipboard! Ready to share.",
    wrappedBtn: "My Puja Wrapped 2026",
    shareStatus: "Share on WhatsApp / Instagram",
    pandalsVisited: "Pandals Visited",
    kmsWalked: "Kilometers Walked",
    favoritePandal: "Top Ranked Pandal",
    biryaniCount: "Biryani & Roll Pitstops"
  },
  bn: {
    appTitle: "শারদোৎসব",
    appSubtitle: "কলকাতা দুর্গাপুজো লাইভ গাইড ও তথ্যভাণ্ডার",
    liveStatus: "লাইভ উৎসব ট্র্যাফিক সক্রিয়",
    navPandals: "মণ্ডপ ও গেট গাইড",
    navHeatmap: "জনতার রাডার",
    navItinerary: "পরিক্রমা রুট",
    navTransit: "মেট্রো ও পার্কিং",
    navAmenities: "শৌচালয় ও খাবার",
    navBondhu: "বন্ধু ও এসওএস",
    navTraffic: "পুলিশ ডাইভারশন",
    navRadio: "ভিন্টেজ রেডিও",
    navInsta: "ইনস্টা স্টুডিও",
    navWrapped: "পুজো র‍্যাপড",
    searchPlaceholder: "নাম, এলাকা বা থিম দিয়ে খুঁজুন...",
    allZones: "সব অঞ্চল",
    northZone: "উত্তর কলকাতা",
    southZone: "দক্ষিণ কলকাতা",
    centralZone: "মধ্য কলকাতা",
    saltLakeZone: "সল্টলেক ও পূর্ব",
    behalaZone: "বেহালা ও পশ্চিম",
    waitMins: "মিনিট লাইন",
    reportWaitBtn: "লাইনের খবর দিন",
    viewGateFlow: "গেট ব্যারিকোড নকশা",
    nearMetro: "নিকটবর্তী মেট্রো",
    exitGate: "বেরোনোর গেট",
    heritageTag: "ঐতিহ্যবাহী পুজো",
    accessibleTag: "হুইলচেয়ার র‍্যাম্প",
    vipPass: "ভিআইপি লেন চালু",
    crowdLow: "স্বাভাবিক (< ২৫ মি)",
    crowdMod: "মাঝারি (২৫-৫০ মি)",
    crowdHeavy: "প্রচণ্ড ভিড় (৫০-৮০ মি)",
    crowdPacked: "অত্যধিক ভিড় (৮০+ মি)",
    updatedAgo: "যাচাইকৃত তথ্য",
    emergencySosBtn: "জরুরি এসওএস (SOS)",
    dial100Notice: "১-ট্যাপে সরাসরি ডায়াল ১০০ / কলকাতা পুলিশ কন্ট্রোল রুম",
    strobeActive: "জরুরি লাল অ্যালার্ম সংকেত সক্রিয়",
    stopStrobe: "অ্যালার্ম বন্ধ করুন",
    offlineBanner: "ইন্টারনেট নেই: অফলাইন মোডে সংরক্ষিত মণ্ডপ ও জরুরি নম্বর সম্পূর্ণ প্রস্তুত।",
    onlineBanner: "লাইভ উৎসব নেটওয়ার্কে যুক্ত হয়েছে।",
    planTripBtn: "পরিক্রমা রুট তৈরি করুন",
    originSelect: "যাত্রার শুরু কোথা থেকে",
    timeWindow: "সময়সীমা",
    transitMode: "যাতায়াতের মাধ্যম",
    walkingDistance: "মোট হাঁটার দূরত্ব",
    crowdForecast: "ভিড়ের পূর্বাভাস",
    findMidpoint: "বন্ধুদের মিলনকেন্দ্র খুঁজুন",
    addFriend: "+ বন্ধুর অবস্থান যোগ করুন",
    recommendedHub: "সেরা মিলনস্থল মেট্রো স্টেশন",
    averageTravelTime: "গড় পৌঁছানোর সময়",
    tuneRadio: "টিউনিং নব ঘোরান",
    radioTuned: "সংকেত স্পষ্ট: ৯৩.৬ মেগাহার্টজ আকাশবাণী কলকাতা",
    radioStatic: "ফ্রিকোয়েন্সি খোঁজা হচ্ছে...",
    copyCaption: "ক্যাপশন কপি করুন",
    copiedToast: "ক্লিপবোর্ডে কপি সম্পন্ন! পোস্ট করুন সোশ্যালে।",
    wrappedBtn: "আমার পুজো র‍্যাপড ২০২৬",
    shareStatus: "হোয়াটসঅ্যাপ / ইনস্টাগ্রামে শেয়ার",
    pandalsVisited: "মোট মণ্ডপ দর্শন",
    kmsWalked: "কিলোমিটার হাঁটা হয়েছে",
    favoritePandal: "সেরা পছন্দের মণ্ডপ",
    biryaniCount: "বিরিয়ানি ও রোল বিরতি"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sharod_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('sharod_lang', nextLang);
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
