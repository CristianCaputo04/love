import React, { useState } from 'react';
import { Plane, Plus, MapPin, X } from 'lucide-react';
import { Trip } from '../types';

interface TravelSectionProps {
  trips: Trip[];
  onAddTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
}

export const TravelSection: React.FC<TravelSectionProps> = ({ trips, onAddTrip, onDeleteTrip }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTrip, setNewTrip] = useState({ destination: '', date: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.destination) return;

    onAddTrip({
      id: Date.now().toString(),
      destination: newTrip.destination,
      date: newTrip.date || new Date().toISOString()
    });
    setNewTrip({ destination: '', date: '' });
    setIsAdding(false);
  };

  const inputClass = "w-full mb-3 px-3 py-2.5 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white/30 transition-all duration-300";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl mt-6 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/15 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
          <Plane className="w-6 h-6 text-amber-300" />
          I Nostri Viaggi
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isAdding ? 'bg-red-500/80 hover:bg-red-600 rotate-45' : 'bg-amber-500/80 hover:bg-amber-600'}`}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-black/20 p-4 rounded-xl animate-fade-in-down border border-white/10">
          <input
            type="text"
            placeholder="Destinazione (es. Parigi)"
            className={inputClass}
            value={newTrip.destination}
            onChange={e => setNewTrip({...newTrip, destination: e.target.value})}
            autoFocus
          />
          <input
            type="date"
            className={`${inputClass} text-sm`}
            value={newTrip.date}
            onChange={e => setNewTrip({...newTrip, date: e.target.value})}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-amber-500/80 hover:bg-amber-600 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">Salva Viaggio</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-sm transition-all">Annulla</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {trips.map(trip => (
          <div key={trip.id} className="relative group bg-white/90 rounded-xl p-3 pb-8 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-lg text-black hover:z-10">
            <div className="bg-gray-100 h-24 w-full rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-200">
               <MapPin className="w-8 h-8 text-rose-400 opacity-60" />
            </div>
            <div className="text-center px-1">
              <p className="font-handwriting font-bold text-gray-800 leading-tight text-lg mb-1">{trip.destination}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{new Date(trip.date).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => onDeleteTrip(trip.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/30 rotate-3 backdrop-blur-sm border-l border-r border-white/40"></div>
          </div>
        ))}
        {trips.length === 0 && !isAdding && (
           <div className="col-span-2 flex flex-col items-center justify-center py-6 text-white/40">
            <Plane className="w-8 h-8 mb-2 opacity-50 rotate-[-15deg]" />
            <p className="text-sm italic">Ancora nessun viaggio aggiunto.</p>
          </div>
        )}
      </div>
    </div>
  );
};