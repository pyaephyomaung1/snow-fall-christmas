'use client'
import React, { useState, useEffect } from 'react';
import { TreeDeciduous, X, Gift, Sparkles, Snowflake, Star, Heart, Music, Bell, CandyCane, StarIcon as StarSolid } from "lucide-react";
import TwinkleLights from "@/components/TwinkleLights";

const App = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [currentWish, setCurrentWish] = useState("");
  const [wishHistory, setWishHistory] = useState<string[]>([]);

  // Expanded Christmas wishes
  const wishes = [
    "May your heart be filled with joy and your home with warmth this Christmas! 🎄",
    "Wishing you peace, love, and laughter throughout the holiday season! ✨",
    "May the magic of Christmas fill every corner of your heart and home! 🎁",
    "Hot cocoa is waiting for you! May your Christmas be sweet and warm! ☕",
    "You deserve a magical holiday filled with wonder and delight! ✨",
    "Be the light that guides others this Christmas season! 🕯️",
    "Laughter is the best gift of all. May yours be abundant! 😄",
    "Snowflakes are winter's butterflies. May they dance around your dreams! ❄️",
    "Peace on Earth and goodwill to all! May we carry it in our hearts! 🌍",
    "May your Christmas be merry, bright, and filled with love! ❤️",
    "Wishing you a season of blessings and joyful reunions! 🎅",
    "May the spirit of Christmas bring you hope and happiness! 🌟",
    "Sending you warmest thoughts and best wishes for the New Year! 🎉",
    "May your holidays sparkle with moments of love and joy! 💫",
    "Wishing you a Christmas as wonderful as you are! 🎄",
    "May your stocking be filled with joy and your heart with peace! 🧦",
    "Here's to a season filled with cozy moments and cherished memories! 🔥",
    "May the sound of jingle bells fill your days with happiness! 🔔",
    "Wishing you a Christmas that's merry, bright, and simply magical! ✨",
    "May your holiday season be wrapped in love and tied with joy! 🎀"
  ];


  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const year = now.getFullYear();
      let xmas = new Date(`December 25, ${year} 00:00:00`);
      
      if (now > xmas) {
        xmas = new Date(`December 25, ${year + 1} 00:00:00`);
      }

      const diff = xmas.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openGift = () => {
    const availableWishes = wishes.filter(wish => !wishHistory.includes(wish));
    const randomWish = availableWishes.length > 0 
      ? availableWishes[Math.floor(Math.random() * availableWishes.length)]
      : wishes[Math.floor(Math.random() * wishes.length)];
    
    setCurrentWish(randomWish);
    setWishHistory(prev => [...prev.slice(-4), randomWish]); // Keep last 5 wishes
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-texture text-slate-50 font-sans overflow-x-hidden relative">
      <main className="container mx-auto px-4 py-12 relative z-20">
        {/* Hero Header */}
        <header className="text-center mb-16 space-y-6">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Star className="text-yellow-400" size={24} />
            <Sparkles className="text-emerald-400" size={28} />
            <StarSolid className="text-red-400" size={24} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold text-slate-100 drop-shadow-2xl tracking-tight">
            Season’s Greetings
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200/90 font-light tracking-wider uppercase mt-6">
            <span className="inline-flex items-center gap-2">
              <Bell className="inline animate-tinkle" size={20} />
              Warm wishes for a calm and joyful holiday
              <Music className="inline" size={20} />
            </span>
          </p>
        </header>

        {/* Countdown Section */}
        <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold border border-white/10 shadow-xl">
            🎄 Christmas Countdown 🎄
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center mt-8">
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/10 blur-xl rounded-2xl" />
                  <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl p-6 w-full">
                    <span className="text-4xl md:text-6xl font-mono font-bold text-slate-100">
                      {String(value).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-slate-300/80 mt-4 font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 text-slate-400 text-sm">
            <CandyCane className="inline mr-2" size={16} />
            Until Santa's arrival!
          </div>
        </div>

        {/* Interactive Cards Section */}
        <div className="flex justify-center w-full max-w-6xl mx-auto mb-20">
          {/* Magic Tree Card */}
          <div className="bg-slate-900/70 p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-between text-center group transition-all duration-500 shadow-xl max-w-md w-full">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3">
                <TreeDeciduous className="text-emerald-400" size={32} />
                <h3 className="text-2xl font-bold text-emerald-400">
                  Magic Tree
                </h3>
              </div>
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-400/10 blur-2xl rounded-full" />
                <TreeDeciduous size={120} className="relative text-emerald-400 group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <p className="text-slate-300/80">
                A small seasonal message, inspired by the spirit of giving.
              </p>
            </div>

            <button 
              onClick={openGift}
              className="mt-8 w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl group/button"
            >
              <Gift className="group-hover/button:rotate-12 transition-transform" size={20} />
              Open a Holiday Message
              <Sparkles className="opacity-0 group-hover/button:opacity-100 transition-opacity" size={16} />
            </button>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-24 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-slate-500/80 text-sm">
            <span className="inline-flex items-center gap-2 hover:text-slate-300 transition-colors cursor-pointer">
              <Heart size={14} /> Share Love
            </span>
            <span className="inline-flex items-center gap-2 hover:text-slate-300 transition-colors cursor-pointer">
              <Star size={14} /> Make a Wish
            </span>
            <span className="inline-flex items-center gap-2 hover:text-slate-300 transition-colors cursor-pointer">
              <Bell size={14} /> Ring Bells
            </span>
          </div>
          
          <div className="text-slate-600 font-medium tracking-wider uppercase text-xs">
            Wishing you peace and good health this holiday season
          </div>
        </footer>
      </main>

      {/* Enhanced Gift Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] max-w-lg w-full text-center shadow-xl animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors hover:scale-110"
            >
              <X size={24} />
            </button>
            
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl animate-bounce-slow">
                <Gift size={48} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2 text-red-400">
              Your Special Christmas Wish! 🎄
            </h2>
            
            <div className="text-lg text-slate-300/80 mb-2">You've received:</div>
            
            <div className="bg-slate-800 border border-white/5 rounded-2xl p-6 my-6">
              <div className="flex items-start gap-4">
                <Sparkles className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                <p className="text-xl text-blue-100 leading-relaxed font-medium text-left">
                  "{currentWish}"
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all hover:shadow-lg"
              >
                Share Joy
              </button>
              <button 
                onClick={openGift}
                className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all hover:shadow-lg"
              >
                Another Wish!
              </button>
            </div>
            
            <div className="mt-6 text-sm text-slate-500">
              {wishHistory.length} of {wishes.length} wishes collected
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        
        @keyframes tinkle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          75% { transform: rotate(-15deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-tinkle {
          animation: tinkle 1s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          /* animation removed */
        }

        .bg-texture {
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
};

export default App;