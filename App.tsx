import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Settings, Calendar, ChevronDown } from 'lucide-react';
import { calculateDuration, getDefaultStartDate } from './utils/dateUtils';
import { RelationshipData, DurationBreakdown, CalendarEvent, Trip, AppData } from './types';
import { SettingsModal } from './components/SettingsModal';
import { QuoteCard } from './components/QuoteCard';
import { CalendarSection } from './components/CalendarSection';
import { TravelSection } from './components/TravelSection';

const DEFAULT_BG = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2940&auto=format&fit=crop";

const App: React.FC = () => {
  // --- State Management ---
  const [data, setData] = useState<RelationshipData>({
    myName: '',
    partnerName: '',
    startDate: '',
    backgroundImageUrl: DEFAULT_BG
  });
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);

  const [duration, setDuration] = useState<DurationBreakdown>({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    const savedData = localStorage.getItem('loveTrackFullData');
    if (savedData) {
      try {
        const parsed: AppData = JSON.parse(savedData);
        // Handle migration from old version if needed
        if (parsed.relationship) {
            setData(parsed.relationship);
            setEvents(parsed.events || []);
            setTrips(parsed.trips || []);
        } else {
            // Legacy format check
            const oldData = localStorage.getItem('loveTrackData');
            if (oldData) {
                setData(JSON.parse(oldData));
            } else {
                setData({
                    myName: 'Io',
                    partnerName: 'Tu',
                    startDate: getDefaultStartDate(),
                    backgroundImageUrl: DEFAULT_BG
                });
            }
        }
      } catch (e) {
        console.error("Error loading data", e);
      }
    } else {
      // Fallback legacy check
      const oldData = localStorage.getItem('loveTrackData');
      if (oldData) {
         setData(JSON.parse(oldData));
      } else {
        setData({
          myName: 'Io',
          partnerName: 'Tu',
          startDate: getDefaultStartDate(),
          backgroundImageUrl: DEFAULT_BG
        });
      }
    }
    setMounted(true);
  }, []);

  // Save all data whenever any part changes
  useEffect(() => {
    if (!mounted) return;
    const fullData: AppData = {
        relationship: data,
        events,
        trips
    };
    localStorage.setItem('loveTrackFullData', JSON.stringify(fullData));
    // Keep legacy for safety if user reverts
    localStorage.setItem('loveTrackData', JSON.stringify(data)); 
  }, [data, events, trips, mounted]);

  // --- Logic ---
  useEffect(() => {
    if (!data.startDate) return;
    const updateTimer = () => setDuration(calculateDuration(data.startDate));
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [data.startDate]);

  const pluralize = (count: number, singular: string, plural: string) => count === 1 ? singular : plural;

  // Optimized Handlers using useCallback
  const handleAddEvent = useCallback((event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleAddTrip = useCallback((trip: Trip) => {
    setTrips(prev => [...prev, trip]);
  }, []);

  const handleDeleteTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleImportData = useCallback((newData: AppData) => {
    setData(newData.relationship);
    setEvents(newData.events);
    setTrips(newData.trips);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-gray-900 overflow-x-hidden font-sans text-white">
      
      {/* Animated Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center animate-ken-burns transition-all duration-1000"
            style={{ backgroundImage: `url(${data.backgroundImageUrl || DEFAULT_BG})` }}
          ></div>
          {/* Gradients and Overlays */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col pb-20">
        
        {/* SECTION 1: Relationship Counter (The Hero) */}
        <div className="min-h-screen flex flex-col justify-center p-6">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-10 animate-fade-in-down">
                <div className="text-center flex-1">
                    <h2 className="text-2xl font-bold drop-shadow-md truncate max-w-[120px] mx-auto">{data.myName}</h2>
                </div>
                <div className="mx-4 relative">
                    <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse-slow drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
                    <div className="absolute inset-0 blur-lg bg-rose-500/30 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center flex-1">
                    <h2 className="text-2xl font-bold drop-shadow-md truncate max-w-[120px] mx-auto">{data.partnerName}</h2>
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-[2.5rem] shadow-2xl p-8 text-center transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group mb-8">
                {/* Shine effect */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine transition-all duration-1000"></div>

                <div className="mb-2 text-rose-200 text-sm font-bold tracking-[0.2em] uppercase">Insieme da</div>
                
                <div className="mb-8">
                    <span className="text-7xl font-bold block drop-shadow-xl tracking-tighter bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                    {duration.totalDays}
                    </span>
                    <span className="text-xl text-white/90 font-medium tracking-wide">Giorni</span>
                </div>

                <div className="h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent mb-8"></div>

                <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold block">{duration.years}</span>
                        <span className="text-xs text-white/70 uppercase tracking-wide">{pluralize(duration.years, 'Anno', 'Anni')}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-r border-white/10">
                        <span className="text-3xl font-bold block">{duration.months}</span>
                        <span className="text-xs text-white/70 uppercase tracking-wide">{pluralize(duration.months, 'Mese', 'Mesi')}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold block">{duration.days}</span>
                        <span className="text-xs text-white/70 uppercase tracking-wide">{pluralize(duration.days, 'Giorno', 'Giorni')}</span>
                    </div>
                </div>
            </div>

            {/* Sub-header Date */}
            <div className="flex justify-center mb-12">
                <div className="flex items-center gap-2 bg-black/30 px-5 py-2 rounded-full backdrop-blur-md border border-white/5 shadow-lg">
                    <Calendar className="w-4 h-4 text-pink-300" />
                    <span className="text-sm font-medium tracking-wide text-pink-50">
                    {new Date(data.startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-float opacity-70">
                <ChevronDown className="w-8 h-8 text-white" />
            </div>
        </div>

        {/* SECTION 2: Daily Quote */}
        <div className="px-6 mb-8">
            <QuoteCard />
        </div>

        {/* SECTION 3: Calendar */}
        <div className="px-6 mb-8">
            <CalendarSection 
                events={events} 
                onAddEvent={handleAddEvent} 
                onDeleteEvent={handleDeleteEvent} 
            />
        </div>

        {/* SECTION 4: Travels */}
        <div className="px-6 mb-20">
            <TravelSection 
                trips={trips} 
                onAddTrip={handleAddTrip} 
                onDeleteTrip={handleDeleteTrip} 
            />
        </div>

      </div>

      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-white/20 hover:bg-rose-500 hover:scale-110 backdrop-blur-md rounded-full shadow-2xl transition-all duration-300 border border-white/20 group"
        aria-label="Impostazioni"
      >
        <Settings className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
      </button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        currentData={data}
        fullData={{ relationship: data, events, trips }}
        onSave={(newData) => setData(newData)}
        onImport={handleImportData}
      />

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .group-hover\\:animate-shine:hover {
          animation: shine 1.5s ease-in-out forwards;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default App;
