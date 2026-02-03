
import React from 'react';
import { IdleAnimation, ThemeMode, AlienReaction, AlienSide } from '../types';

interface PurpleAlienProps {
  isActive: boolean;
  isProcessing: boolean;
  onClick: () => void;
  idleAnimation: IdleAnimation;
  theme: ThemeMode;
  reaction: AlienReaction;
  side: AlienSide;
}

export const PurpleAlien: React.FC<PurpleAlienProps> = ({ 
  isActive, 
  isProcessing, 
  onClick, 
  idleAnimation, 
  theme,
  reaction,
  side
}) => {
  // Logic for peeking translation
  // If active, it's fully visible at the edge.
  // If not active, it's partially hidden (sneaking).
  const isRight = side === 'right';
  const translateClass = isActive 
    ? 'translate-x-0' 
    : isRight 
      ? 'translate-x-[60%] sm:translate-x-[55%]' 
      : '-translate-x-[60%] sm:-translate-x-[55%]';

  const positionClass = isRight ? 'right-0' : 'left-0';

  let animClass = '';
  if (isProcessing) {
    animClass = 'alien-wiggle'; 
  } else if (isActive && idleAnimation !== 'none') {
    switch (idleAnimation) {
      case 'wiggle': animClass = 'alien-wiggle'; break;
      case 'float': animClass = 'alien-float'; break;
      case 'pulse': animClass = 'alien-pulse'; break;
    }
  }

  const themeStyles = {
    dark: {
      body: 'bg-purple-600',
      antenna: 'bg-purple-400',
      tip: 'bg-pink-500',
      glow: 'bg-purple-500/30',
      border: 'border-purple-300/30',
      gradient: 'linear-gradient(135deg, #d946ef 0%, #a855f7 50%, #7e22ce 100%)'
    },
    light: {
      body: 'bg-sky-500',
      antenna: 'bg-sky-300',
      tip: 'bg-cyan-400',
      glow: 'bg-sky-400/30',
      border: 'border-sky-200/30',
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 50%, #0369a1 100%)'
    },
    desert: {
      body: 'bg-orange-500',
      antenna: 'bg-orange-300',
      tip: 'bg-amber-400',
      glow: 'bg-orange-400/30',
      border: 'border-orange-200/30',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)'
    }
  }[theme];

  const eyeBaseSize = reaction === 'afraid' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-9 h-9 md:w-12 md:h-12';
  const pupilBaseSize = reaction === 'afraid' ? 'w-2 h-2 md:w-3 h-3' : 'w-4 h-4 md:w-6 h-6';

  // Body rounded corners based on side
  const roundedClass = isRight 
    ? 'rounded-l-[3rem] md:rounded-l-[4rem]' 
    : 'rounded-r-[3rem] md:rounded-r-[4rem]';

  // Floating label positioning
  const labelPosClass = isRight ? 'right-full mr-4 md:mr-8' : 'left-full ml-4 md:ml-8';
  const labelAnimClass = isRight ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2';

  return (
    <div 
      className={`fixed ${positionClass} top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-in-out cursor-pointer scale-75 md:scale-100 ${translateClass}`}
      onClick={onClick}
    >
      <div className={`relative group ${animClass}`}>
        <div className={`absolute ${labelPosClass} top-1/2 -translate-y-1/2 bg-slate-900 border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-sm font-bold tracking-tight shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform ${labelAnimClass} hidden sm:block`}>
          {isActive ? 'Go back to sleep 🤫' : `Wake up GLOOB! 🛸`}
        </div>

        <div className="relative w-36 h-48 md:w-48 md:h-56 flex items-center justify-center">
          <div className={`absolute inset-0 blur-[30px] md:blur-[40px] rounded-full transition-all duration-1000 ${themeStyles.glow} ${isActive ? 'opacity-100' : 'opacity-40'}`}></div>
          
          <div 
            className={`w-32 h-40 md:w-40 md:h-48 ${roundedClass} shadow-2xl flex flex-col items-center justify-center p-3 md:p-4 sneaky-alien transition-all duration-1000 relative overflow-visible border-4 ${themeStyles.body} ${themeStyles.border}`}
            style={{ background: themeStyles.gradient }}
          >
            {/* Eyes Container */}
            <div className="flex space-x-2 md:space-x-3 mt-2 md:mt-4 z-10 items-center justify-center min-h-[48px] md:min-h-[64px]">
              {[0, 1].map((i) => (
                <div key={i} className={`${eyeBaseSize} bg-white rounded-full flex items-center justify-center border-2 md:border-4 border-slate-900 eye-glow overflow-hidden relative transition-all duration-300`}>
                  <div className={`${pupilBaseSize} bg-black rounded-full eye-blink transition-all duration-300 relative ${isProcessing ? 'scale-110' : ''}`}>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-80"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mouth */}
            <div className={`mt-4 md:mt-6 transition-all duration-500 relative overflow-visible z-10 ${
              reaction === 'happy' 
                ? 'w-10 h-6 md:w-14 md:h-8 bg-transparent border-b-4 md:border-b-8 border-slate-950 rounded-[50%] -mt-1 md:-mt-2' 
                : `w-12 h-4 md:w-16 md:h-6 bg-slate-950 rounded-full border border-slate-800 ${isProcessing ? 'h-8 md:h-10' : 'h-4 md:h-6'}`
            }`}>
               {isActive && !isProcessing && reaction === 'neutral' && (
                 <div className={`absolute top-1 left-2 md:left-3 w-7 h-1 md:w-10 md:h-2 opacity-60 rounded-full blur-[1px] ${themeStyles.tip}`}></div>
               )}
               {isProcessing && (
                 <div className="w-full h-full flex items-center justify-center">
                    <div className={`w-full h-1 md:h-2 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse`}></div>
                 </div>
               )}
            </div>

            {/* Antennas */}
            <div className={`absolute -top-6 md:-top-10 left-1/4 z-10 origin-bottom transition-all duration-300 ${isProcessing ? 'alien-ear-wiggle' : 'hover:scale-110'}`}>
               <div className={`w-4 h-10 md:w-6 md:h-14 rounded-full rotate-[-25deg] border-2 shadow-lg transition-all duration-1000 ${themeStyles.antenna} ${themeStyles.border}`}></div>
               <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full -mt-10 md:-mt-16 -ml-1 md:-ml-2 animate-bounce shadow-lg transition-all duration-1000 ${themeStyles.tip}`}></div>
            </div>
            <div className={`absolute -top-6 md:-top-10 right-1/4 z-10 origin-bottom transition-all duration-300 ${isProcessing ? 'alien-ear-wiggle' : 'hover:scale-110'}`}>
               <div className={`w-4 h-10 md:w-6 md:h-14 rounded-full rotate-[25deg] border-2 shadow-lg transition-all duration-1000 ${themeStyles.antenna} ${themeStyles.border}`}></div>
               <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full -mt-10 md:-mt-16 -mr-1 md:-mr-2 animate-bounce shadow-lg transition-all duration-1000 ${themeStyles.tip}`} style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
