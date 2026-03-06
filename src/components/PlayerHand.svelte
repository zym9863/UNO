<script lang="ts">
  import type { Card as CardType } from '../lib/types';
  import Card from './Card.svelte';

  interface Props {
    cards: CardType[];
    playableIds: Set<string>;
    onplay: (card: CardType) => void;
  }

  let { cards, playableIds, onplay }: Props = $props();
</script>

<div class="player-hand-container">
  <div class="hand-label bangers-font">YOUR HAND</div>
  <div class="player-hand">
    {#each cards as card (card.id)}
      <div class="card-slot">
        <Card
          {card}
          playable={playableIds.has(card.id)}
          onclick={() => playableIds.has(card.id) && onplay(card)}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .player-hand-container {
    position: relative;
    padding: 10px;
  }

  .hand-label {
    position: absolute;
    top: -30px;
    left: 20px;
    background: var(--uno-blue);
    color: var(--uno-white);
    padding: 4px 12px;
    font-size: 1.5rem;
    border: var(--border-thick);
    transform: rotate(-3deg);
    z-index: 10;
    box-shadow: 2px 2px 0px var(--uno-black);
  }

  .player-hand {
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 20px 20px 0 20px;
    overflow-x: auto;
    max-width: 100%;
    background: rgba(255, 255, 255, 0.5);
    border: var(--border-thick);
    box-shadow: var(--shadow-offset);
    border-radius: 8px;
    min-height: 160px;
  }

  .card-slot {
    margin-left: -30px;
    transition: margin 0.2s, transform 0.2s;
  }

  .card-slot:first-child {
    margin-left: 0;
  }

  .card-slot:hover {
    margin-left: -10px;
    margin-right: 20px;
    z-index: 20;
    transform: translateY(-10px);
  }
</style>

