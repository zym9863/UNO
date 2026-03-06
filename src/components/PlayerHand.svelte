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

<style>
  .player-hand {
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 10px 20px;
    overflow-x: auto;
    max-width: 100%;
  }

  .card-slot {
    margin-left: -20px;
    transition: margin 0.2s;
  }

  .card-slot:first-child {
    margin-left: 0;
  }

  .card-slot:hover {
    margin-left: -10px;
    margin-right: 10px;
  }
</style>
