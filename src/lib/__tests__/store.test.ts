import { afterEach, describe, expect, it, vi } from 'vitest';
import { gameState, handlePlayerChallenge, playCard, chooseWildColor, resetGame } from '../store.svelte';
import type { Card, Color, Player } from '../types';
import * as ai from '../ai';

function card(id: string, color: Color | null, type: Card['type'], value?: number): Card {
  return { id, color, type, value };
}

function player(id: number, hand: Card[], isAI: boolean): Player {
  return {
    id,
    name: isAI ? `AI ${id}` : 'You',
    hand,
    isAI,
    saidUno: false,
  };
}

afterEach(() => {
  resetGame();
});

describe('wild draw 4 challenge resolution', () => {
  it('judges legality against the color before +4 was played', () => {
    const wildDraw4 = card('w4', null, 'wild_draw4');
    const matchingRed = card('r5', 'red', 'number', 5);

    Object.assign(gameState, {
      players: [
        player(0, [wildDraw4, matchingRed], true),
        player(1, [], false),
      ],
      drawPile: [
        card('d1', 'blue', 'number', 1),
        card('d2', 'green', 'number', 2),
        card('d3', 'yellow', 'number', 3),
        card('d4', 'blue', 'number', 4),
      ],
      discardPile: [card('top', 'red', 'number', 7)],
      currentPlayerIndex: 0,
      direction: 1 as const,
      currentColor: 'red' as const,
      phase: 'playing' as const,
      winner: null,
      lastPlayedBy: null,
      wildDraw4BaseColor: null,
    });

    playCard(wildDraw4, 0);

    gameState.currentColor = 'blue';
    handlePlayerChallenge(true);

    expect(gameState.players[0].hand).toHaveLength(5);
    expect(gameState.players[1].hand).toHaveLength(0);
    expect(gameState.wildDraw4BaseColor).toBeNull();
  });
});

describe('wild draw 4 as last card - win detection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('human wins when playing wild_draw4 as last card and AI does not challenge', () => {
    vi.spyOn(ai, 'shouldChallenge').mockReturnValue(false);

    const wildDraw4 = card('w4', null, 'wild_draw4');
    Object.assign(gameState, {
      players: [
        player(0, [wildDraw4], false),
        player(1, [card('r1', 'red', 'number', 1)], true),
      ],
      drawPile: [
        card('d1', 'blue', 'number', 1),
        card('d2', 'green', 'number', 2),
        card('d3', 'yellow', 'number', 3),
        card('d4', 'blue', 'number', 4),
      ],
      discardPile: [card('top', 'red', 'number', 7)],
      currentPlayerIndex: 0,
      direction: 1 as const,
      currentColor: 'red' as Color,
      phase: 'playing' as const,
      winner: null,
      lastPlayedBy: null,
      wildDraw4BaseColor: null,
    });

    playCard(wildDraw4, 0);
    expect(gameState.phase).toBe('choosing_color');

    chooseWildColor('blue');
    expect(gameState.winner).toBe(0);
    expect(gameState.phase).toBe('result');
    expect(gameState.players[0].hand).toHaveLength(0);
  });

  it('human wins when AI challenges last-card wild_draw4 but challenge fails', () => {
    vi.spyOn(ai, 'shouldChallenge').mockReturnValue(true);

    const wildDraw4 = card('w4', null, 'wild_draw4');
    Object.assign(gameState, {
      players: [
        player(0, [wildDraw4], false),
        player(1, [card('r1', 'red', 'number', 1)], true),
      ],
      drawPile: [
        card('d1', 'blue', 'number', 1),
        card('d2', 'green', 'number', 2),
        card('d3', 'yellow', 'number', 3),
        card('d4', 'blue', 'number', 4),
        card('d5', 'red', 'number', 5),
        card('d6', 'green', 'number', 6),
      ],
      discardPile: [card('top', 'red', 'number', 7)],
      currentPlayerIndex: 0,
      direction: 1 as const,
      currentColor: 'red' as Color,
      phase: 'playing' as const,
      winner: null,
      lastPlayedBy: null,
      wildDraw4BaseColor: null,
    });

    playCard(wildDraw4, 0);
    chooseWildColor('blue');

    expect(gameState.winner).toBe(0);
    expect(gameState.phase).toBe('result');
    expect(gameState.players[0].hand).toHaveLength(0);
    expect(gameState.players[1].hand).toHaveLength(7);
  });

  it('human wins when next human player declines challenge on last-card wild_draw4', () => {
    const wildDraw4 = card('w4', null, 'wild_draw4');
    Object.assign(gameState, {
      players: [
        player(0, [], false),
        player(1, [card('r1', 'red', 'number', 1)], false),
      ],
      drawPile: [
        card('d1', 'blue', 'number', 1),
        card('d2', 'green', 'number', 2),
        card('d3', 'yellow', 'number', 3),
        card('d4', 'blue', 'number', 4),
      ],
      discardPile: [card('top', 'red', 'number', 7), wildDraw4],
      currentPlayerIndex: 0,
      direction: 1 as const,
      currentColor: 'blue' as Color,
      phase: 'challenging' as const,
      winner: null,
      lastPlayedBy: 0,
      wildDraw4BaseColor: 'red' as Color,
    });

    handlePlayerChallenge(false);

    expect(gameState.winner).toBe(0);
    expect(gameState.phase).toBe('result');
    expect(gameState.players[1].hand).toHaveLength(5);
  });
});
