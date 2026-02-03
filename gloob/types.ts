
export interface AutocorrectResult {
  original: string;
  corrected: string;
  isChanged: boolean;
  explanation?: string;
}

export enum AlienState {
  HIDING = 'hiding',
  SNEAKING = 'sneaking',
  ACTIVE = 'active'
}

export type IdleAnimation = 'none' | 'wiggle' | 'float' | 'pulse';

export type ThemeMode = 'dark' | 'light' | 'desert';

export type AlienReaction = 'neutral' | 'afraid' | 'happy';

export type AlienSide = 'left' | 'right';
