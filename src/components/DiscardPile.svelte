<script lang="ts">
  import type { Card as CardType } from '../lib/types';
  import Card from './Card.svelte';

  interface Props {
    topCard: CardType;
  }

  let { topCard }: Props = $props();
</script>

<div class="discard-pile">
  <div class="label bangers-font">DISCARD</div>
  
  <div class="pile-container">
    <div class="stack stack-3"></div>
    <div class="stack stack-2"></div>
    <div class="stack stack-1"></div>
    <div class="top-card">
      <Card card={topCard} />
    </div>
  </div>
</div>

<style>
  .discard-pile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .label {
    color: var(--uno-black);
    font-size: 1.5rem;
    background: var(--uno-white);
    padding: 0 8px;
    border: var(--border-thick);
    box-shadow: 2px 2px 0px var(--uno-black);
    transform: rotate(2deg);
  }

  .pile-container {
    position: relative;
    width: 90px;
    height: 135px;
  }

  .stack {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--uno-white);
    border: var(--border-thick);
  }

  .stack-1 { top: 4px; left: -4px; z-index: 1; transform: rotate(-5deg); background: var(--uno-red); }
  .stack-2 { top: 8px; left: 2px; z-index: 0; transform: rotate(3deg); background: var(--uno-green); }
  .stack-3 { top: 2px; left: 6px; z-index: -1; transform: rotate(-2deg); background: var(--uno-yellow); }

  .top-card {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    transform: rotate(1deg);
  }
</style>

