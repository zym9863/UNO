<script lang="ts">
  import Card from './Card.svelte';

  interface Props {
    cardCount: number;
    position: 'top' | 'left' | 'right';
    name: string;
    isActive: boolean;
  }

  let { cardCount, position, name, isActive }: Props = $props();

  let dummyCards = $derived(
    Array.from({ length: cardCount }, (_, i) => ({
      id: `dummy-${i}`,
      color: null as any,
      type: 'number' as const,
    }))
  );
</script>

<div class="ai-hand {position}" class:active={isActive}>
  <div class="ai-name">{name} ({cardCount})</div>
  <div class="ai-cards">
    {#each dummyCards as card (card.id)}
      <div class="ai-card-slot">
        <Card {card} faceDown />
      </div>
    {/each}
  </div>
</div>

<style>
  .ai-hand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .ai-hand.active {
    filter: drop-shadow(0 0 12px rgba(255, 255, 100, 0.6));
  }

  .ai-name {
    color: #fff;
    font-size: 0.9rem;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  .ai-cards {
    display: flex;
  }

  .top .ai-cards {
    flex-direction: row;
  }

  .left .ai-cards,
  .right .ai-cards {
    flex-direction: column;
  }

  .ai-card-slot {
    margin-left: -40px;
  }

  .ai-card-slot:first-child {
    margin-left: 0;
  }

  .left .ai-card-slot,
  .right .ai-card-slot {
    margin-left: 0;
    margin-top: -70px;
  }

  .left .ai-card-slot:first-child,
  .right .ai-card-slot:first-child {
    margin-top: 0;
  }

  .left .ai-cards :global(.card),
  .right .ai-cards :global(.card) {
    --card-width: 50px;
    --card-height: 75px;
  }

  .left .ai-cards :global(.card) {
    transform: rotate(90deg);
  }

  .right .ai-cards :global(.card) {
    transform: rotate(-90deg);
  }

  .top .ai-cards :global(.card) {
    --card-width: 55px;
    --card-height: 82px;
  }
</style>
