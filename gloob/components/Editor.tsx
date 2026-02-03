
import React, { useState, useEffect, useRef } from 'react';
import { getAutocorrect } from '../services/geminiService';
import { AutocorrectResult, ThemeMode, AlienReaction } from '../types';

interface EditorProps {
  isExtensionOn: boolean;
  onProcessingChange: (processing: boolean) => void;
  onReactionChange: (reaction: AlienReaction) => void;
  theme: ThemeMode;
}

export const Editor: React.FC<EditorProps> = ({ 
  isExtensionOn, 
  onProcessingChange, 
  onReactionChange,
  theme 
}) => {
  const [text, setText] = useState('');
  const [lastCorrectedText, setLastCorrectedText] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);

    if (!isExtensionOn) {
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    onReactionChange('neutral');

    if (val.trim().length > 5 && val !== lastCorrectedText) {
      timeoutRef.current = setTimeout(async () => {
        onProcessingChange(true);
        onReactionChange('afraid');

        const result = await getAutocorrect(val);
        
        if (result.isChanged && result.corrected !== val) {
          const selectionStart = textareaRef.current?.selectionStart;
          const selectionEnd = textareaRef.current?.selectionEnd;

          setText(result.corrected);
          setLastCorrectedText(result.corrected);
          onReactionChange('happy');
          
          setTimeout(() => {
            if (textareaRef.current && selectionStart !== undefined) {
              textareaRef.current.setSelectionRange(selectionStart, selectionEnd || selectionStart);
            }
            setTimeout(() => onReactionChange('neutral'), 3000);
          }, 0);
        } else {
          onReactionChange('neutral');
        }
        
        onProcessingChange(false);
      }, 1200);
    }
  };

  const themeClasses = {
    dark: {
      wrapper: 'bg-slate-900 border-slate-800',
      titleBar: 'bg-slate-800 border-slate-700',
      text: 'text-slate-400',
      area: 'bg-slate-950 text-slate-100 border-slate-800',
      footer: 'text-slate-500'
    },
    light: {
      wrapper: 'bg-white border-slate-200 shadow-xl',
      titleBar: 'bg-slate-100 border-slate-200',
      text: 'text-slate-600',
      area: 'bg-slate-50 text-slate-900 border-slate-200',
      footer: 'text-slate-400'
    },
    desert: {
      wrapper: 'bg-orange-50 border-orange-200',
      titleBar: 'bg-orange-100 border-orange-200',
      text: 'text-orange-700',
      area: 'bg-white text-orange-900 border-orange-100',
      footer: 'text-orange-600'
    }
  }[theme];

  return (
    <div className={`w-full h-full max-h-[500px] md:max-h-[600px] rounded-xl shadow-2xl border flex flex-col overflow-hidden transition-colors duration-500 ${themeClasses.wrapper}`}>
      {/* Title Bar */}
      <div className={`px-4 py-2 flex items-center justify-between border-b transition-colors duration-500 ${themeClasses.titleBar}`}>
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <div className="text-[10px] md:text-xs font-mono opacity-60 truncate px-2">GLOOB Workspace v4.0.2</div>
        <div className="flex items-center gap-2">
           {isExtensionOn && (
             <span className="text-[8px] md:text-[10px] uppercase tracking-tighter font-bold text-green-500 animate-pulse hidden sm:inline">
               Auto-Correction Live
             </span>
           )}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-3 md:space-y-4">
        <label className={`text-[10px] md:text-sm font-medium uppercase tracking-wider transition-colors duration-500 ${themeClasses.text}`}>
          Smart Typing Area
        </label>
        
        <div className="relative flex-1 min-h-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            placeholder="Start typing... GLOOB will automatically polish your words."
            className={`w-full h-full p-4 md:p-6 rounded-lg border focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none font-mono text-sm md:text-lg transition-all duration-500 ${themeClasses.area}`}
          />
        </div>

        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] md:text-xs transition-colors duration-500 ${themeClasses.footer}`}>
          <div className="flex items-center whitespace-nowrap">
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isExtensionOn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {isExtensionOn ? 'Active' : 'Offline'}
          </div>
          <div className="opacity-60">Chars: {text.length}</div>
          <div className="ml-auto opacity-40 italic hidden sm:block">Pause to auto-correct</div>
        </div>
      </div>
    </div>
  );
};
