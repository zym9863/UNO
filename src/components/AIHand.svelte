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
  <div class="ai-name bangers-font">{name} <span class="badge">{cardCount}</span></div>
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
    gap: 8px;
    background: var(--uno-white);
    padding: 10px;
    border: var(--border-thick);
    box-shadow: 4px 4px 0px var(--uno-black);
    position: relative;
    max-width: 300px;
  }

  .ai-hand.active {
    background: var(--uno-yellow);
    transform: translateY(-4px);
    box-shadow: 8px 8px 0px var(--uno-black);
  }

  .ai-name {
    color: var(--uno-black);
    font-size: 1.5rem;
    position: absolute;
    top: -15px;
    background: var(--uno-white);
    padding: 2px 8px;
    border: 2px solid var(--uno-black);
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 10;
  }

  .ai-hand.active .ai-name {
    background: var(--uno-red);
    color: var(--uno-white);
  }
  
  .badge {
    background: var(--uno-black);
    color: var(--uno-white);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .ai-cards {
    display: flex;
    padding-top: 10px;
  }

  .top .ai-cards {
    flex-direction: row;
  }

  .left, .right {
    max-width: 120px;
  }

  .left .ai-cards,
  .right .ai-cards {
    flex-direction: column;
  }

  .ai-card-slot {
    margin-left: -20px;
  }

  .ai-card-slot:first-child {
    margin-left: 0;
  }

  .left .ai-card-slot,
  .right .ai-card-slot {
    margin-left: 0;
    margin-top: -50px;
  }

  .left .ai-card-slot:first-child,
  .right .ai-card-slot:first-child {
    margin-top: 0;
  }

  .left .ai-cards :global(.card),
  .right .ai-cards :global(.card),
  .top .ai-cards :global(.card) {
    --card-width: 60px;
    --card-height: 90px;
  }
</style>

