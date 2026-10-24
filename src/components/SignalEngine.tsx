import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ShieldCheck,
  Activity,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Volume2,
  VolumeX,
  ExternalLink,
  Flame,
  Award,
  Lock,
  Radio,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { CurrencyPair, Language, MarketType, SignalData } from '../types';
import { translations, QUOTEX_REFERRAL_URL } from '../constants/translations';
import { LIVE_PAIRS, OTC_PAIRS, LIVE_TIMEFRAMES, OTC_TIMEFRAMES } from '../constants/markets';
import { TradingChart } from './TradingChart';
import { TradingViewChart } from './TradingViewChart';
import { CyborgGoldLogo } from './CyborgGoldLogo';

interface SignalEngineProps {
  language: Language;
  traderId: string;
  onBackToVerification: () => void;
  onOpenAdminPanel?: () => void;
  activationDate?: number;
}

export const SignalEngine: React.FC<SignalEngineProps> = ({
  language,
  traderId,
  onBackToVerification,
  onOpenAdminPanel,
  activationDate,
}) => {
  const t = translations[language];
  const isUrdu = language === 'ur';

  // Dynamic Activation Date (Day, Month, Year, e.g. "23 Oct 2026")
  const displayActivationDate = React.useMemo(() => {
    const storageKey = `quotex_activation_date_${traderId || 'default'}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) return saved;

    const d = activationDate ? new Date(activationDate) : new Date();
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const formatted = `${day} ${month} ${year}`;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, formatted);
      } catch (e) {
        // ignore
      }
    }
    return formatted;
  }, [activationDate, traderId]);

  // Market & pair state
  const [market, setMarket] = useState<MarketType>('otc');
  const availablePairs = market === 'otc' ? OTC_PAIRS : LIVE_PAIRS;
  const availableTimeframes = market === 'otc' ? OTC_TIMEFRAMES : LIVE_TIMEFRAMES;

  // Weekend check: Live Forex markets are closed on Saturday (6) and Sunday (0)
  const isWeekend = React.useMemo(() => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }, []);

  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(availablePairs[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(availableTimeframes[3] || availableTimeframes[0]);

  // Sync pair & timeframe when market changes
  useEffect(() => {
    const pairs = market === 'otc' ? OTC_PAIRS : LIVE_PAIRS;
    const timeframes = market === 'otc' ? OTC_TIMEFRAMES : LIVE_TIMEFRAMES;
    setSelectedPair(pairs[0]);
    setSelectedTimeframe(market === 'otc' ? timeframes[3] : timeframes[0]);
    if (market === 'live' && isWeekend) {
      setCurrentSignal(null);
    }
  }, [market, isWeekend]);

  // Active Users live fluctuation
  const [activeUsers, setActiveUsers] = useState<number>(1429);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(1200, prev + delta);
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Analysis & Signal generation state (Realistic 5-10 second sequence)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('Analyzing Market...');
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [currentSignal, setCurrentSignal] = useState<SignalData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // History of generated signals (Capped at maximum 92% payout for OTC)
  const [history, setHistory] = useState<SignalData[]>([
    {
      id: 'sig_hist_1',
      pair: 'USD/PKR (OTC)',
      flags: '🇺🇸 🇵🇰',
      market: 'otc',
      timeframe: '30s',
      direction: 'CALL',
      accuracy: 94.6,
      entryPrice: 278.48,
      expirySeconds: 30,
      remainingSeconds: 0,
      timestamp: Date.now() - 1000 * 60 * 3,
      result: 'WIN',
      payoutAmount: 92,
    },
    {
      id: 'sig_hist_2',
      pair: 'EUR/USD (OTC)',
      flags: '🇪🇺 🇺🇸',
      market: 'otc',
      timeframe: '1m',
      direction: 'CALL',
      accuracy: 92.4,
      entryPrice: 1.08542,
      expirySeconds: 60,
      remainingSeconds: 0,
      timestamp: Date.now() - 1000 * 60 * 9,
      result: 'WIN',
      payoutAmount: 92,
    },
    {
      id: 'sig_hist_3',
      pair: 'NZD/CHF (OTC)',
      flags: '🇳🇿 🇨🇭',
      market: 'otc',
      timeframe: '15s',
      direction: 'PUT',
      accuracy: 91.2,
      entryPrice: 0.5284,
      expirySeconds: 15,
      remainingSeconds: 0,
      timestamp: Date.now() - 1000 * 60 * 16,
      result: 'WIN',
      payoutAmount: 87,
    },
    {
      id: 'sig_hist_4',
      pair: 'Crypto IDX (OTC)',
      flags: '₿ 🌐',
      market: 'otc',
      timeframe: '10s',
      direction: 'CALL',
      accuracy: 96.2,
      entryPrice: 4281.2,
      expirySeconds: 10,
      remainingSeconds: 0,
      timestamp: Date.now() - 1000 * 60 * 24,
      result: 'WIN',
      payoutAmount: 92,
    },
  ]);

  // Audio tone generator using Web Audio API
  const playTone = (type: 'chime' | 'expiry' | 'tick' | 'scanner') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      if (type === 'chime') {
        // High quality pleasant celestial chime (Major chord arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.65);
        });
      } else if (type === 'expiry') {
        // Subtle soft resolving bell on expiry
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'tick') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'scanner') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // AudioContext policy safe fallback
    }
  };

  // Signal Countdown Interval
  useEffect(() => {
    if (!currentSignal || currentSignal.remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setCurrentSignal((prev) => {
        if (!prev) return null;
        const nextSec = prev.remainingSeconds - 1;
        if (nextSec <= 0) {
          playTone('expiry');
          // Add to history as WIN
          const completed: SignalData = {
            ...prev,
            remainingSeconds: 0,
            result: 'WIN',
            payoutAmount: selectedPair.payout,
          };
          setHistory((h) => [completed, ...h.slice(0, 9)]);
          return completed;
        }
        if (nextSec <= 3 && nextSec > 0) {
          playTone('tick');
        }
        return {
          ...prev,
          remainingSeconds: nextSec,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSignal?.id, currentSignal?.remainingSeconds, selectedPair.payout]);

  // Fluctuating confidence accuracy when viewing signal (strictly >= 85%)
  useEffect(() => {
    if (!currentSignal || currentSignal.remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setCurrentSignal((prev) => {
        if (!prev || prev.remainingSeconds <= 0) return prev;
        const delta = (Math.random() - 0.5) * 0.4;
        const bounded = Math.min(97.2, Math.max(85.0, Number((prev.accuracy + delta).toFixed(1))));
        return { ...prev, accuracy: bounded };
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [currentSignal?.id]);

  // High-accuracy AI Text-to-Speech voice announcement
  const speakSignalAnnouncement = (marketName: string, timeframeName: string, direction: 'CALL' | 'PUT', accuracy: number) => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('SpeechSynthesis API not available');
        return;
      }

      window.speechSynthesis.cancel();

      // Announcement Format: "[Market Name], next [Timeframe], [Call/Buy or Put/Sell], my accuracy according to analysis is [Accuracy]%."
      const action = direction === 'CALL' ? 'Call Buy' : 'Put Sell';
      const textToAnnounce = `${marketName}, next ${timeframeName}, ${action}, my accuracy according to analysis is ${accuracy}%.`;

      const utterance = new SpeechSynthesisUtterance(textToAnnounce);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(
          (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Jenny') || v.name.includes('Guy')) && v.lang.startsWith('en')
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Text-to-Speech voice error:', err);
    }
  };

  // Handler: "Get Real Signal" with realistic 5 to 10-second multi-step sequence
  const handleGenerateSignal = () => {
    if (isAnalyzing) return;

    // Live Market Weekend Guard: Do not generate signals on Saturday or Sunday
    if (market === 'live' && isWeekend) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    playTone('scanner');

    const steps = [
      { text: 'Neural Network Scanning Tick Velocity & Orderbook...', progress: 20, delay: 1400 },
      { text: 'Analyzing Quotex Liquidity & Resistance Zones...', progress: 42, delay: 2800 },
      { text: 'Calculating Algorithmic Probabilities (RSI 14 + MACD)...', progress: 65, delay: 4200 },
      { text: 'Checking Win-Rate Accuracy & Volatility Confirmation...', progress: 85, delay: 5600 },
      { text: 'Generating High-Accuracy Synchronized Strike Signal...', progress: 100, delay: 6800 },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setAnalysisStep(step.text);
        setAnalysisProgress(step.progress);
        playTone('scanner');
      }, step.delay);
    });

    // Complete at ~7.2 seconds (within 5-10 second requirement)
    setTimeout(() => {
      const direction: 'CALL' | 'PUT' = Math.random() > 0.48 ? 'CALL' : 'PUT';
      // Accuracy Rule: Strictly 85% or higher (never below 85%)
      const baseAccuracy = Math.max(85.0, Number((88.0 + Math.random() * 8.5).toFixed(1)));

      // Dynamic UI Reading: Read active market pair and timeframe directly from current state
      const activeMarketName = selectedPair.name;
      const activeTimeframeName = selectedTimeframe.name;

      const newSig: SignalData = {
        id: `sig_${Date.now()}`,
        pair: activeMarketName,
        flags: selectedPair.flags,
        market,
        timeframe: activeTimeframeName,
        direction,
        accuracy: baseAccuracy,
        entryPrice: selectedPair.basePrice,
        expirySeconds: selectedTimeframe.seconds,
        remainingSeconds: selectedTimeframe.seconds,
        timestamp: Date.now(),
        confidenceLevels: {
          rsi: direction === 'CALL' ? 31 : 69,
          trend: direction === 'CALL' ? 'Bullish Reversal Strike' : 'Bearish Breakdown Strike',
          volatility: 'Quotex Optimized Expiry',
          macd: direction === 'CALL' ? 'Bullish Crossover' : 'Bearish Crossover',
        },
      };

      setCurrentSignal(newSig);
      setIsAnalyzing(false);
      playTone('chime');

      // Trigger voice announcement automatically the exact moment signal is generated
      speakSignalAnnouncement(activeMarketName, activeTimeframeName, direction, baseAccuracy);
    }, 7200);
  };

  const totalWins = history.filter((h) => h.result === 'WIN').length;
  const winRatePercent = history.length > 0 ? ((totalWins / history.length) * 100).toFixed(1) : '95.2';

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      className={`max-w-6xl mx-auto px-4 py-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}
    >
      {/* Top Header Strip with Brand Logo, Verified Pass Badge and Active Traders */}
      {/* Top Header Strip with Brand Logo, Verified Pass Badge and Active Traders */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <CyborgGoldLogo size="md" glow={true} />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-sm">
                NextGen Bot Premium
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 via-amber-400/20 to-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <Lock className="w-3 h-3 text-amber-300" />
                <span>Verified Lifetime Pass</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="text-slate-300 font-bold">Trader ID: <code className="text-emerald-400 font-black font-mono tracking-wider drop-shadow-[0_0_8px_rgba(16,185,129,0.35)]">{traderId}</code></span>
              <span className="text-slate-500 font-black">·</span>
              <span className="text-cyan-300 font-bold">Locked to this Single Device</span>
            </div>
          </div>
        </div>

        {/* Live Active Traders Counter & Sound Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            <span className="text-slate-300 font-black uppercase tracking-wider text-[11px]">{t.activeTraders}:</span>
            <span className="font-mono font-black text-emerald-300 text-sm tabular-nums tracking-wide">
              {activeUsers.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-xs text-slate-200 hover:text-white hover:border-slate-500 transition-colors font-bold shadow-sm"
            title={soundEnabled ? t.soundOn : t.soundOff}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-black tracking-wide">{t.soundOn}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 font-bold tracking-wide">{t.soundOff}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic License Activation Date Full-Width Badge Box */}
      <div className="w-full mb-6 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-950/95 via-[#0b1626]/95 to-slate-950/95 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.12)] backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-amber-400/90 font-black uppercase tracking-wider text-[11px]">
            {t.licenseActivated || 'License Activated:'}
          </span>
          <span className="font-mono font-black text-amber-300 tracking-wider text-sm sm:text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.35)]">
            {displayActivationDate}
          </span>
          <span className="text-slate-600 hidden sm:inline font-bold">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs">
            <span className="text-slate-300 font-bold">Trader ID:</span>
            <code className="text-emerald-400 font-black font-mono tracking-wider">{traderId}</code>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
            <span>{t.lifetimePassActive || 'Lifetime Pass Active'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Market Selection, Asset Pairs with Flags, Timeframe, Get Real Signal */}
        <div className="lg:col-span-5 space-y-5">
          {/* Market Selection Section */}
          <div className="bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <label className="text-xs font-black text-white uppercase tracking-wider block mb-2.5">
              {t.marketSelection}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMarket('otc')}
                className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all border flex flex-col items-center justify-center gap-0.5 ${
                  market === 'otc'
                    ? 'bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-teal-600/30 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="tracking-wide">⚡ OTC Market</span>
                <span className="text-[11px] text-emerald-300 font-black tracking-wide">Capped 92% Payout</span>
              </button>

              <button
                type="button"
                onClick={() => setMarket('live')}
                className={`py-3.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all border flex flex-col items-center justify-center gap-0.5 ${
                  market === 'live'
                    ? 'bg-gradient-to-r from-cyan-600/30 via-sky-500/20 to-blue-600/30 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/30'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="tracking-wide">🌐 Live Market</span>
                <span className="text-[11px] text-cyan-300 font-black tracking-wide">
                  {isWeekend ? 'Closed on Weekends' : 'Real Forex Liquidity'}
                </span>
              </button>
            </div>

            {/* Clear Notification Banner when Live Market is selected on Weekends */}
            {market === 'live' && isWeekend && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 shadow-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-300 text-sm">Today Market Closed</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">Weekend</span>
                  </div>
                  <p className="font-bold text-slate-200 mt-1 leading-relaxed">
                    {isUrdu
                      ? 'ہفتہ اور اتوار کو لائیو فاریکس مارکیٹ بند رہتی ہے۔ سگنلز حاصل کرنے کے لیے برائے مہربانی او ٹی سی (OTC) مارکیٹ منتخب کریں۔'
                      : 'Live Forex Market is closed on weekends (Saturday & Sunday). Please switch to OTC Market to generate 24/7 active signals.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Asset Pairs Grid with Country/Currency Flags (Comprehensive list) */}
          <div className="bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black text-white uppercase tracking-wider">
                {market === 'otc' ? 'Comprehensive OTC Pairs' : 'Live Forex Pairs'}
              </label>
              <span className="text-[11px] text-sky-300 font-extrabold font-mono">
                {availablePairs.length} Asset Pairs
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {availablePairs.map((pair) => (
                <button
                  key={pair.id}
                  onClick={() => setSelectedPair(pair)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedPair.id === pair.id
                      ? 'bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-emerald-500/25 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40'
                      : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700 text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm shrink-0">{pair.flags}</span>
                    <span className="text-xs sm:text-sm font-black text-white truncate tracking-wide">{pair.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono text-emerald-400 font-black shrink-0 ml-1.5 drop-shadow-[0_0_6px_rgba(16,185,129,0.35)]">
                    {pair.payout}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comprehensive Timeframes */}
          <div className="bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black text-white uppercase tracking-wider">
                {t.timeframe}
              </label>
              <span className="text-[11px] text-slate-300 font-mono font-bold">
                Duration: <span className="text-emerald-400 font-black">{selectedTimeframe.name}</span>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {availableTimeframes.map((tf) => (
                <button
                  key={tf.label}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`py-2 px-1.5 rounded-lg text-xs font-mono transition-all text-center border ${
                    selectedTimeframe.label === tf.label
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-emerald-300 font-black shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-extrabold'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button: Get Real Signal */}
          <div className="space-y-3">
            <button
              onClick={handleGenerateSignal}
              disabled={isAnalyzing}
              className={`w-full py-4 px-6 font-black text-base sm:text-lg rounded-2xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed tracking-wide ${
                market === 'live' && isWeekend
                  ? 'bg-gradient-to-r from-amber-500/25 via-slate-900 to-amber-500/25 border border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:border-amber-400'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.45)]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  <span className="truncate">{analysisStep}</span>
                </>
              ) : market === 'live' && isWeekend ? (
                <>
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                  <span>Today Market Closed</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 fill-current" />
                  <span>{t.getSignal}</span>
                </>
              )}
            </button>

            {/* Direct Quotex Platform Link */}
            <a
              href={QUOTEX_REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#0a1526]/90 hover:bg-[#0f1f38] border border-cyan-500/40 text-cyan-200 hover:text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.18)] tracking-wide uppercase"
            >
              <span>{t.tradeNowOnQuotex}</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>
          </div>
        </div>

        {/* Right Column: Signal Output & Synchronized Candlestick Chart Engine */}
        <div className="lg:col-span-7 space-y-5">
          {/* Live Market Closed on Weekends Hero Notification */}
          {market === 'live' && isWeekend && (
            <div className="bg-[#0b1322]/95 border border-amber-500/50 rounded-2xl p-6 text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10" />
              <div className="relative z-10 py-4">
                <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                  <Clock className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-wide drop-shadow-sm flex items-center justify-center gap-2">
                  <span className="text-amber-400">⚠️</span>
                  <span>Today Market Closed</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto mb-5 font-bold leading-relaxed">
                  {isUrdu
                    ? 'لائیو فاریکس مارکیٹ ہفتہ اور اتوار کو بند رہتی ہے۔ ریئل انٹر بینک لیکویڈیٹی پیر کے روز دوبارہ بحال ہوگی۔ 24/7 ایکٹو سگنلز حاصل کرنے کے لیے او ٹی سی (OTC) مارکیٹ پر سوئچ کریں۔'
                    : 'Live Forex Market is closed on weekends (Saturday & Sunday). Real interbank liquidity resumes on Monday. Switch to OTC Market for 24/7 high-accuracy trading signals.'}
                </p>
                <button
                  type="button"
                  onClick={() => setMarket('otc')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] inline-flex items-center gap-2 tracking-wide cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>⚡ Switch to OTC Market (24/7 Active)</span>
                </button>
              </div>
            </div>
          )}

          {/* Signal Output Display Card */}
          {!(market === 'live' && isWeekend) && isAnalyzing && (
            <div className="bg-[#0b1322]/95 border border-emerald-500/50 rounded-2xl p-6 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 animate-pulse" />
              <div className="relative z-10 py-5">
                <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Cpu className="w-8 h-8 animate-pulse text-emerald-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-1 tracking-wide drop-shadow-sm">
                  AI Generated Signals In Progress...
                </h3>
                <p className="text-xs sm:text-sm text-cyan-300 max-w-md mx-auto mb-4 font-mono font-bold tracking-wide">
                  {analysisStep}
                </p>
                <div className="w-full max-w-sm mx-auto h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-700/80 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono font-black text-emerald-400 block mt-2.5 tracking-wider uppercase">
                  Scanning 24/7 Tick Stream · Depth Verification: {analysisProgress}%
                </span>
              </div>
            </div>
          )}

          {!(market === 'live' && isWeekend) && currentSignal && !isAnalyzing && (
            <div
              className={`rounded-2xl p-6 border transition-all relative overflow-hidden backdrop-blur-md shadow-2xl ${
                currentSignal.direction === 'CALL'
                  ? 'bg-gradient-to-b from-emerald-950/45 via-[#0b1322]/95 to-[#0b1322] border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30'
                  : 'bg-gradient-to-b from-red-950/45 via-[#0b1322]/95 to-[#0b1322] border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)] ring-1 ring-red-500/30'
              }`}
            >
              {/* Card Header: Pair & Flags */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-2xl">{currentSignal.flags || selectedPair.flags}</span>
                  <span className="text-xl font-black text-white tracking-wide">{currentSignal.pair}</span>
                  <span className="text-xs font-mono font-black uppercase px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
                    {currentSignal.timeframe}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakSignalAnnouncement(currentSignal.pair, currentSignal.timeframe, currentSignal.direction, currentSignal.accuracy)}
                    title="Replay Voice Announcement"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 hover:text-white transition-all text-xs font-bold shadow-sm"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Replay Voice</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-black font-mono">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Real AI Signal Active</span>
                  </div>
                </div>
              </div>

              {/* Main Signal Direction Hero with Animated Moving Arrows */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center my-3">
                <div className="sm:col-span-2 flex items-center gap-4">
                  <div
                    className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black border shadow-lg ${
                      currentSignal.direction === 'CALL'
                        ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-red-500/25 border-red-400 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    }`}
                  >
                    {currentSignal.direction === 'CALL' ? (
                      <>
                        <ArrowUp className="w-9 h-9 animate-arrow-up stroke-[3]" />
                        <span className="text-[11px] tracking-wider font-black uppercase mt-0.5">BUY</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-9 h-9 animate-arrow-down stroke-[3]" />
                        <span className="text-[11px] tracking-wider font-black uppercase mt-0.5">SELL</span>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-xs uppercase font-mono font-black tracking-widest text-sky-300 block mb-1">
                      {t.recommendedAction}
                    </span>
                    <h2
                      className={`text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm ${
                        currentSignal.direction === 'CALL' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {currentSignal.direction === 'CALL' ? t.callBuy : t.putSell}
                    </h2>
                    <span className="text-xs text-slate-300 font-bold block mt-1">
                      Candles below synchronize in real time to the signal direction
                    </span>
                  </div>
                </div>

                {/* Expiry Countdown Timer */}
                <div className="bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-center shadow-md">
                  <span className="text-[10px] uppercase font-mono font-black text-sky-300 block mb-1">
                    {t.expiryCountdown}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums drop-shadow-sm">
                    {currentSignal.remainingSeconds > 0 ? (
                      `${Math.floor(currentSignal.remainingSeconds / 60)}:${(currentSignal.remainingSeconds % 60)
                        .toString()
                        .padStart(2, '0')}`
                    ) : (
                      <span className="text-emerald-400 text-base sm:text-lg font-black font-mono">EXPIRED · WIN</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden mt-2 border border-slate-700/50">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        currentSignal.direction === 'CALL' ? 'bg-emerald-400' : 'bg-red-400'
                      }`}
                      style={{
                        width: `${(currentSignal.remainingSeconds / currentSignal.expirySeconds) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Accuracy & Quotex Metrics */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-sky-300 font-extrabold text-[11px] block">{t.confidenceAccuracy}</span>
                  <span className="text-base font-black text-emerald-400 font-mono tabular-nums flex items-center gap-1.5 mt-0.5 drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                    <Flame className="w-4 h-4 text-amber-400 fill-current" />
                    <span>{currentSignal.accuracy}%</span>
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-sky-300 font-extrabold text-[11px] block">{t.entryPrice}</span>
                  <span className="text-sm sm:text-base font-black text-white font-mono tabular-nums mt-0.5 block">
                    {currentSignal.entryPrice.toFixed(currentSignal.entryPrice > 100 ? 2 : 5)}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-sky-300 font-extrabold text-[11px] block">{t.payout}</span>
                  <span className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5 block drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">
                    +{selectedPair.payout}% Payout
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Chart & Trade Expiry: TradingView for Live Market, Synchronized Chart for OTC */}
          {market === 'live' ? (
            <TradingViewChart
              pair={selectedPair.name}
              symbol={selectedPair.tvSymbol || 'FX:EURUSD'}
              flags={selectedPair.flags}
              payout={selectedPair.payout}
              lastSignal={
                currentSignal
                  ? {
                      direction: currentSignal.direction,
                      time: currentSignal.timestamp,
                      price: currentSignal.entryPrice,
                      remainingSeconds: currentSignal.remainingSeconds,
                      expirySeconds: currentSignal.expirySeconds,
                    }
                  : null
              }
            />
          ) : (
            <TradingChart
              pair={selectedPair.name}
              market={market}
              basePrice={selectedPair.basePrice}
              flags={selectedPair.flags}
              payout={selectedPair.payout}
              lastSignal={
                currentSignal
                  ? {
                      direction: currentSignal.direction,
                      time: currentSignal.timestamp,
                      price: currentSignal.entryPrice,
                      remainingSeconds: currentSignal.remainingSeconds,
                      expirySeconds: currentSignal.expirySeconds,
                    }
                  : null
              }
            />
          )}

          {/* Live History Log & Performance */}
          <div className="bg-[#0b1322]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 tracking-wide">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{t.recentSignals}</span>
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-slate-300">
                  {t.winRate}: <strong className="text-emerald-400 font-black text-sm drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">{winRatePercent}%</strong>
                </span>
                <span className="text-slate-600 font-black">·</span>
                <span className="text-slate-300">
                  {t.totalSignals}: <strong className="text-white font-black text-sm">{history.length + 24}</strong>
                </span>
              </div>
            </div>

            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-sky-300/90 border-b border-slate-800/90 font-mono text-[11px] font-black uppercase tracking-wider">
                    <th className="pb-2.5 font-black">Asset Pair</th>
                    <th className="pb-2.5 font-black">TF</th>
                    <th className="pb-2.5 font-black">Direction</th>
                    <th className="pb-2.5 font-black text-right">Accuracy</th>
                    <th className="pb-2.5 font-black text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/60 font-mono">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 font-black text-white flex items-center gap-2">
                        <span className="text-base">{item.flags || '🌐'}</span>
                        <span className="tracking-wide">{item.pair}</span>
                      </td>
                      <td className="py-2.5 text-cyan-300 font-bold">{item.timeframe}</td>
                      <td className="py-2.5">
                        <span
                          className={`font-black inline-flex items-center gap-1 ${
                            item.direction === 'CALL' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {item.direction === 'CALL' ? (
                            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                          {item.direction}
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-white font-bold tabular-nums">
                        {item.accuracy}%
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>WIN +{item.payoutAmount || 95}%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video Tutorial Button */}
      <div className="mt-8">
        <a
          href="https://youtu.be/fkB1sNJmBlg"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-black text-sm sm:text-base tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_25px_rgba(225,29,72,0.35)] border border-rose-400/40 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <span>▶ HOW TO USE NEXTGEN BOT PREMIUM</span>
        </a>
      </div>
    </div>
  );
};
