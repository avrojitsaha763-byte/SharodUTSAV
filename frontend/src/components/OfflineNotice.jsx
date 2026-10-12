import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OfflineNotice() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && dismissed) return null;

  return (
    <aside aria-label="Network Status" className={`w-full py-2 px-4 text-xs font-medium flex items-center justify-between transition-colors ${
      isOnline
        ? 'bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300'
        : 'bg-rose-950/90 border-b border-rose-500/40 text-rose-200 animate-pulse'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('onlineBanner')}</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('offlineBanner')}</span>
              <span className="hidden sm:inline-flex items-center ml-2 text-rose-400/80 bg-rose-900/50 px-2 py-0.5 rounded text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1" /> PWA Cache Active
              </span>
            </>
          )}
        </div>
        {isOnline && (
          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-400/70 hover:text-emerald-200 ml-4 underline text-[11px]"
          >
            Dismiss
          </button>
        )}
      </div>
    </aside>
  );
}
