<script lang="ts">
  import type { Player } from '../lib/types';
  import { getCardScore } from '../lib/rules';

  interface Props {
    players: Player[];
    winnerId: number;
    onrestart: () => void;
    onmenu: () => void;
  }

  let { players, winnerId, onrestart, onmenu }: Props = $props();

  let winner = $derived(players.find(p => p.id === winnerId)!);

  let scores = $derived(
    players.map(p => ({
      name: p.name,
      score: p.hand.reduce((sum, card) => sum + getCardScore(card), 0),
      isWinner: p.id === winnerId,
    }))
  );
</script>

<div class="result">
  <h1 class="winner-title">
    {winner.name === 'You' ? 'You Win!' : `${winner.name} Wins!`}
  </h1>

  <div class="scoreboard">
    <h2>Scores</h2>
    {#each scores as entry}
      <div class="score-row" class:winner={entry.isWinner}>
        <span class="name">{entry.name}</span>
        <span class="score">{entry.isWinner ? 'WINNER' : `${entry.score} pts remaining`}</span>
      </div>
    {/each}
  </div>

  <div class="actions">
    <button class="btn primary" onclick={onrestart}>Play Again</button>
    <button class="btn secondary" onclick={onmenu}>Main Menu</button>
  </div>
</div>

<style>
  .result {
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at center, #1a5c2a 0%, #0d3318 60%, #091a0e 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    color: #fff;
    font-family: 'Arial Black', Arial, sans-serif;
  }

  .winner-title {
    font-size: 3rem;
    text-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
    color: #ffd700;
    margin: 0;
  }

  .scoreboard {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding: 24px 40px;
    min-width: 300px;
  }

  .scoreboard h2 {
    margin: 0 0 16px;
    font-size: 1.2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
  }

  .score-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1rem;
  }

  .score-row.winner {
    color: #ffd700;
  }

  .score {
    font-weight: normal;
    font-family: Arial, sans-serif;
  }

  .actions {
    display: flex;
    gap: 16px;
  }

  .btn {
    padding: 14px 36px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 50px;
    border: 3px solid #fff;
    cursor: pointer;
    transition: transform 0.2s;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #fff;
  }

  .btn:hover {
    transform: scale(1.05);
  }

  .primary {
    background: linear-gradient(135deg, #ff4444, #cc0000);
    box-shadow: 0 4px 16px rgba(255, 0, 0, 0.4);
  }

  .secondary {
    background: rgba(255, 255, 255, 0.15);
  }
</style>
