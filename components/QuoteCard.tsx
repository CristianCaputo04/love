import React, { useState, useEffect } from 'react';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';

// Massive combined database for variety
const ALL_QUOTES = [
  // Amore
  "L'amore non è guardarsi a vicenda, ma guardare insieme nella stessa direzione.",
  "Se so cos'è l'amore, è grazie a te.",
  "Ti amo non per chi sei, ma per chi sono io quando sto con te.",
  "L'amore è composto da un'unica anima che abita due corpi.",
  "Dove c'è amore c'è vita.",
  "Il vero amore non ha mai fine.",
  "Amare è trovare la propria ricchezza al di fuori di sé.",
  "Sei il mio oggi e tutti i miei domani.",
  
  // Amicizia
  "Un amico è qualcuno che sa tutto di te e ti ama comunque.",
  "La vera amicizia resiste al tempo, alla distanza e al silenzio.",
  "Chi trova un amico trova un tesoro.",
  "L'amicizia raddoppia le gioie e divide le angosce.",
  
  // Palestra / Sport
  "Il dolore di oggi è la forza di domani.",
  "Non fermarti quando sei stanco, fermati quando hai finito.",
  "Il corpo ottiene ciò che la mente crede.",
  "La disciplina è fare ciò che va fatto, anche quando non hai voglia di farlo.",
  "Non sognare il risultato, lavora per ottenerlo.",
  
  // Università / Studio
  "L'istruzione è l'arma più potente che puoi usare per cambiare il mondo.",
  "Investire in conoscenza paga sempre i migliori interessi.",
  "Non studiare per l'esame, studia per la vita.",
  "Le radici dell'educazione sono amare, ma il frutto è dolce.",
  "Il successo è la somma di piccoli sforzi, ripetuti giorno dopo giorno.",
  
  // Bellezza
  "La bellezza inizia nel momento in cui decidi di essere te stesso.",
  "Non c'è cosmetico per la bellezza come la felicità.",
  "La bellezza è negli occhi di chi guarda.",
  "L'eleganza è la sola bellezza che non sfiorisce mai.",
  
  // Vita / Futuro
  "La vita è per il 10% cosa ti accade e per il 90% come reagisci.",
  "Sogna come se dovessi vivere per sempre. Vivi come se dovessi morire oggi.",
  "Il modo migliore per predire il futuro è crearlo.",
  "Tutto ciò che puoi immaginare è reale.",
  "Non contare i giorni, fai in modo che i giorni contino.",
  "La vita è un'avventura audace o non è nulla.",
  "Sii il cambiamento che vuoi vedere nel mondo.",
  
  // Famiglia / Sorella
  "Una sorella è un pezzo di infanzia che non potrà mai smarrirsi.",
  "Le sorelle sono fiori diversi dello stesso giardino.",
  "La famiglia è dove la vita inizia e l'amore non finisce mai.",
  "Avere un posto dove andare è casa. Avere qualcuno da amare è famiglia.",
  "La famiglia non è una cosa importante. È tutto."
];

export const QuoteCard: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to get a random quote ensuring it's not the same as the current one
  const getRandomQuote = (exclude?: string) => {
    let newQuote;
    do {
      const randomIndex = Math.floor(Math.random() * ALL_QUOTES.length);
      newQuote = ALL_QUOTES[randomIndex];
    } while (newQuote === exclude && ALL_QUOTES.length > 1);
    return newQuote;
  };

  // Initial load
  useEffect(() => {
    setCurrentQuote(getRandomQuote());
  }, []);

  const handleNextQuote = () => {
    setIsAnimating(true);
    // Wait for fade out
    setTimeout(() => {
      setCurrentQuote(getRandomQuote(currentQuote));
      setIsAnimating(false);
    }, 300); // matches duration-300
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:bg-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-500"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-bold flex items-center gap-2 text-rose-100">
          <Quote className="w-5 h-5 fill-current" />
          Pensiero del Giorno
        </h3>
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>
      
      <div className={`min-h-[100px] flex items-center justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-xl sm:text-2xl italic text-white font-serif text-center leading-relaxed drop-shadow-sm">
          "{currentQuote}"
        </p>
      </div>

      <button 
        onClick={handleNextQuote}
        className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 border border-white/10 group-hover:border-white/30"
      >
        <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} />
        Nuova Ispirazione
      </button>
    </div>
  );
};