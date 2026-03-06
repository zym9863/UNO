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
  <div class="winner-title bangers-font">
    {winner.name === 'You' ? 'YOU SURVIVED!' : `${winner.name} SLAUGHTERED YOU!`}
  </div>

  <div class="scoreboard brutalist-panel">
    <h2 class="bangers-font">THE CARNAGE</h2>
    {#each scores as entry}
      <div class="score-row" class:winner={entry.isWinner}>
        <span class="name bangers-font">{entry.name}</span>
        <span class="score">{entry.isWinner ? 'WINNER' : `${entry.score} PTS`}</span>
      </div>
    {/each}
  </div>

  <div class="actions">
    <button class="brutalist-button play-again" onclick={onrestart}>PLAY AGAIN</button>
    <button class="brutalist-button menu-btn" onclick={onmenu}>MAIN MENU</button>
  </div>
</div>

<style>
  .result {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  .winner-title {
    font-size: 6rem;
    color: var(--uno-red);
    text-shadow: 4px 4px 0px var(--uno-black), 8px 8px 0px var(--uno-yellow);
    transform: rotate(-3deg);
    text-align: center;
  }

  .scoreboard {
    width: 400px;
    background: var(--uno-blue);
    transform: rotate(2deg);
  }

  .scoreboard h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 20px;
    color: var(--uno-white);
    text-shadow: 2px 2px 0px var(--uno-black);
  }

  .score-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--uno-white);
    border: 2px solid var(--uno-black);
    margin-bottom: 10px;
    font-size: 1.2rem;
    box-shadow: 2px 2px 0px var(--uno-black);
  }

  .score-row.winner {
    background: var(--uno-yellow);
    transform: scale(1.05) translateX(-10px);
    box-shadow: 4px 4px 0px var(--uno-black);
    z-index: 10;
  }

  .name {
    font-size: 1.5rem;
    letter-spacing: 1px;
  }

  .score {
    font-weight: 700;
  }

  .actions {
    display: flex;
    gap: 24px;
    transform: rotate(-1deg);
  }

  .play-again {
    background: var(--uno-green);
  }

  .menu-btn {
    background: var(--uno-white);
  }
</style>

