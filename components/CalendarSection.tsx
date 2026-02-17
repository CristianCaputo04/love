import React, { useState } from 'react';
import { Calendar as CalIcon, Plus, Trash2, Clock } from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarSectionProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ events, onAddEvent, onDeleteEvent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    
    onAddEvent({
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      category: 'activity'
    });
    setNewEvent({ title: '', date: '' });
    setIsAdding(false);
  };

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Matches SettingsModal style
  const inputClass = "w-full mb-3 px-3 py-2.5 rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white/30 transition-all duration-300";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-white/15 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
          <CalIcon className="w-6 h-6 text-blue-300" />
          Prossimi Eventi
        </h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isAdding ? 'bg-red-500/80 hover:bg-red-600 rotate-45' : 'bg-blue-500/80 hover:bg-blue-600'}`}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 bg-black/20 p-4 rounded-xl animate-fade-in-down border border-white/10">
          <input
            type="text"
            placeholder="Nome evento (es. Cena)"
            className={inputClass}
            value={newEvent.title}
            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
            autoFocus
          />
          <input
            type="datetime-local"
            className={`${inputClass} text-sm`} // text-sm for better date input display on mobile
            value={newEvent.date}
            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-500/80 hover:bg-green-600 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">Aggiungi</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-sm transition-all">Annulla</button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-white/40">
            <CalIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm italic">Nessun evento programmato.</p>
          </div>
        ) : (
          sortedEvents.map(event => (
            <div key={event.id} className="group flex justify-between items-center bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all duration-300">
              <div>
                <h4 className="font-semibold text-white tracking-wide">{event.title}</h4>
                <p className="text-xs text-blue-200 flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.date).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button 
                onClick={() => onDeleteEvent(event.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all transform hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};