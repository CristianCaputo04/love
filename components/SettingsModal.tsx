import React, { useState, useEffect } from 'react';
import { X, Save, Heart, Download, Upload, AlertCircle } from 'lucide-react';
import { RelationshipData, AppData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: RelationshipData;
  fullData: AppData; // Need full data for export
  onSave: (data: RelationshipData) => void;
  onImport: (data: AppData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentData,
  fullData,
  onSave,
  onImport
}) => {
  const [formData, setFormData] = useState<RelationshipData>(currentData);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    setFormData(currentData);
  }, [currentData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lovetrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.relationship && json.events && json.trips) {
           onImport(json);
           onClose();
           alert('Dati importati con successo!');
        } else {
           setImportError('Formato file non valido.');
        }
      } catch (err) {
        setImportError('Errore durante la lettura del file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200/50 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/80 focus:border-transparent transition-all duration-300 shadow-inner";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50 max-h-[90vh] overflow-y-auto transform transition-all scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-5 flex justify-between items-center text-white sticky top-0 z-10 shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 fill-current animate-pulse-slow" />
            Impostazioni
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Il Tuo Nome
            </label>
            <input
              type="text"
              name="myName"
              value={formData.myName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Inserisci nome"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Nome del Partner
            </label>
            <input
              type="text"
              name="partnerName"
              value={formData.partnerName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Inserisci nome partner"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              Data dell'Anniversario
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate.split('T')[0]} 
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
              URL Sfondo (Opzionale)
            </label>
             <input
              type="url"
              name="backgroundImageUrl"
              value={formData.backgroundImageUrl}
              onChange={handleChange}
              className={`${inputClass} text-xs`}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salva Modifiche
          </button>

          <div className="border-t border-gray-200 pt-6 mt-6">
             <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider text-center">Backup & Ripristino</h3>
             
             <div className="grid grid-cols-2 gap-3">
               <button
                 type="button"
                 onClick={handleExport}
                 className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-200 shadow-sm hover:shadow-md active:scale-95"
               >
                 <Download className="w-4 h-4" />
                 Esporta
               </button>

               <div className="relative w-full">
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button
                    type="button"
                    className="w-full h-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    Importa
                  </button>
               </div>
             </div>
             {importError && (
               <p className="text-red-500 text-xs mt-3 flex items-center justify-center gap-1 bg-red-50 py-2 rounded-lg">
                 <AlertCircle className="w-3 h-3" /> {importError}
               </p>
             )}
          </div>
        </form>
      </div>
    </div>
  );
};