export type Color = 'red' | 'yellow' | 'green' | 'blue';

export type CardType = 'number' | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild_draw4';

export interface Card {
  id: string;
  color: Color | null;
  type: CardType;
  value?: number;
}

export interface Player {
  id: number;
  name: string;
  hand: Card[];
  isAI: boolean;
  saidUno: boolean;
}

export type Phase = 'menu' | 'playing' | 'choosing_color' | 'challenging' | 'result';

export interface GameState {
  players: Player[];
  drawPile: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  direction: 1 | -1;
  currentColor: Color;
  phase: Phase;
  winner: number | null;
  lastPlayedBy: number | null;
  wildDraw4BaseColor: Color | null;
}

export const COLORS: Color[] = ['red', 'yellow', 'green', 'blue'];

export const COLOR_HEX: Record<Color, string> = {
  red: '#ED1C24',
  yellow: '#FFDE00',
  green: '#00A651',
  blue: '#0072BC',
};
