
import React, { useState, useEffect } from 'react';
import { PurpleAlien } from './components/PurpleAlien';
import { Editor } from './components/Editor';
import { ParticleOverlay } from './components/ParticleOverlay';
import { IdleAnimation, ThemeMode, AlienReaction, AlienSide } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [isExtensionOn, setIsExtensionOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [reaction, setReaction] = useState<AlienReaction>('neutral');
  const [alienSide, setAlienSide] = useState<AlienSide>('right');
  
  const idleAnimation: IdleAnimation = 'float';

  // Timer to shift alien side every 10 minutes
  useEffect(() => {
    const TEN_MINUTES = 10 * 60 * 1000;
    const interval = setInterval(() => {
      setAlienSide(prev => (prev === 'right' ? 'left' : 'right'));
    }, TEN_MINUTES);

    return () => clearInterval(interval);
  }, []);

  const toggleExtension = () => {
    const nextState = !isExtensionOn;
    setIsExtensionOn(nextState);
    
    if (nextState) {
      audioService.playAppear();
      setReaction('neutral');
    } else {
      audioService.playDisappear();
      setReaction('neutral');
    }
  };

  useEffect(() => {
    if (isProcessing) {
      audioService.startProcessing();
    } else {
      audioService.stopProcessing();
    }
  }, [isProcessing]);

  const themes: { id: ThemeMode; label: string; icon: string; color: string }[] = [
    { id: 'dark', label: 'Space', icon: 'fa-moon', color: '#a855f7' },
    { id: 'light', label: 'Cloud', icon: 'fa-sun', color: '#0ea5e9' },
    { id: 'desert', label: 'Dune', icon: 'fa-cactus', color: '#f97316' },
  ];

  const bgClasses = {
    dark: 'from-purple-900 via-slate-950 to-black',
    light: 'from-sky-100 via-white to-sky-50',
    desert: 'from-orange-400 via-amber-200 to-orange-100',
  }[theme];

  const titleGradient = {
    dark: 'from-purple-400 via-pink-400 to-purple-400',
    light: 'from-sky-600 via-cyan-600 to-sky-600',
    desert: 'from-orange-700 via-amber-700 to-orange-700',
  }[theme];

  const footerTextClass = {
    dark: 'text-purple-400/60',
    light: 'text-sky-700/60',
    desert: 'text-orange-900/60',
  }[theme];

  const taglineColor = {
    dark: 'text-purple-100/80',
    light: 'text-sky-900/80',
    desert: 'text-orange-950/80',
  }[theme];

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-between p-4 md:p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${bgClasses} transition-all duration-1000 overflow-x-hidden relative`}>
      
      <ParticleOverlay theme={theme} />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden z-0">
        <div className={`absolute top-10 left-10 w-48 h-48 md:w-64 md:h-64 rounded-full blur-[80px] md:blur-[120px] transition-colors duration-1000 ${theme === 'desert' ? 'bg-yellow-400' : theme === 'light' ? 'bg-sky-400' : 'bg-purple-500'}`}></div>
        <div className={`absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px] md:blur-[150px] transition-colors duration-1000 ${theme === 'desert' ? 'bg-orange-600' : theme === 'light' ? 'bg-cyan-400' : 'bg-pink-500'}`}></div>
      </div>

      {/* Header */}
      <div className="w-full text-center z-10 pt-4 md:pt-0">
        <h1 className={`text-5xl sm:text-7xl md:text-9xl font-black mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} tracking-[0.15em] md:tracking-[0.2em] font-classic title-glow transition-all duration-1000`}>
          GLOOB
        </h1>
        <p className={`text-sm sm:text-lg md:text-xl font-serif italic max-w-lg mx-auto leading-relaxed px-4 transition-colors duration-1000 ${taglineColor}`}>
          An elegant system-wide autocorrect extension.
        </p>
      </div>

      {/* Simulated Desktop Window */}
      <div className="relative z-10 w-full max-w-4xl flex justify-center flex-1 my-6 md:my-8 items-center">
        <Editor 
          isExtensionOn={isExtensionOn} 
          onProcessingChange={setIsProcessing}
          onReactionChange={setReaction}
          theme={theme}
        />
      </div>

      {/* Theme Controls Container */}
      <div className="z-20 flex flex-col items-center gap-4 mb-4">
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 p-1 rounded-2xl flex flex-wrap justify-center gap-1 shadow-2xl">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center space-x-2 px-4 md:px-6 py-2 rounded-xl transition-all duration-300 text-[10px] md:text-xs font-bold uppercase tracking-widest ${
                theme === t.id 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-white/40 hover:text-white/80 hover:bg-white/10'
              }`}
            >
              <i className={`fa-solid ${t.icon}`}></i>
              <span className="inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* The Sneaky Theme-Aware Alien */}
      <PurpleAlien 
        isActive={isExtensionOn} 
        isProcessing={isProcessing}
        idleAnimation={idleAnimation}
        onClick={toggleExtension}
        theme={theme}
        reaction={reaction}
        side={alienSide}
      />

      {/* Footer Instructions */}
      <footer className={`${footerTextClass} w-full text-[10px] sm:text-xs md:text-sm font-serif flex flex-wrap justify-center items-center gap-y-2 gap-x-4 sm:gap-x-8 md:gap-x-12 z-10 transition-colors duration-1000 pb-4 text-center px-4`}>
        <div className="flex items-center whitespace-nowrap">
          <i className="fa-solid fa-feather-pointed mr-1 md:mr-2 opacity-80"></i>
          Gemini 3 Flash
        </div>
        <div className="flex items-center whitespace-nowrap">
          <i className="fa-solid fa-scroll mr-1 md:mr-2 opacity-80"></i>
          v4.0.2
        </div>
        <div className="flex items-center whitespace-nowrap uppercase tracking-widest text-[9px] md:text-xs font-bold">
          <i className="fa-solid fa-compass mr-1 md:mr-2 opacity-80"></i>
          {theme} Habitat
        </div>
        <div className="flex items-center whitespace-nowrap font-bold tracking-tight">
          <i className="fa-solid fa-galactic-republic mr-1 md:mr-2 opacity-80"></i>
           By PkGalaxy
        </div>
      </footer>
    </div>
  );
};

export default App;
