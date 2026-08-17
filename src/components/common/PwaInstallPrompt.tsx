import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Sparkles, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Install App Button */}
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
        title="Install Bight Real Estate Web App on your device"
      >
        <Download className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Manual Install Instructions Modal for iOS / Desktop / Android */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in duration-150">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-serif">Install Bight Real Estate</h3>
                  <p className="text-[11px] text-slate-400">Progressive Web Application (PWA)</p>
                </div>
              </div>
              <button
                onClick={() => setIsInstallModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Install our application for fast offline access, instant notifications on luxury listings, and full-screen browsing.
              </p>

              {isIOS ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>How to Install on iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="space-y-2 text-slate-600 list-decimal list-inside text-[11px]">
                    <li className="flex items-center gap-2">
                      <span>1. Tap the</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-900">
                        <Share className="w-3 h-3 text-blue-600" /> Share
                      </span>
                      <span>button in Safari toolbar.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>2. Scroll down and select</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-900">
                        <PlusSquare className="w-3 h-3 text-slate-700" /> Add to Home Screen
                      </span>
                    </li>
                    <li>3. Tap <strong>Add</strong> at top right to complete installation.</li>
                  </ol>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-amber-600" />
                    <span>How to Install on Chrome / Edge / Android</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    <li>• Click the <strong>Install</strong> icon in your browser URL address bar.</li>
                    <li>• Or tap your browser menu (<strong>⋮</strong>) and choose <strong>Install app</strong> / <strong>Add to Home screen</strong>.</li>
                  </ul>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsInstallModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Got It
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
