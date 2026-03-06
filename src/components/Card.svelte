<script lang="ts">
  import type { Card } from '../lib/types';
  import { COLOR_HEX } from '../lib/types';

  interface Props {
    card: Card;
    faceDown?: boolean;
    playable?: boolean;
    onclick?: () => void;
  }

  let { card, faceDown = false, playable = false, onclick }: Props = $props();

  let displayValue = $derived(() => {
    if (card.type === 'number') return String(card.value);
    if (card.type === 'skip') return '\u2298';
    if (card.type === 'reverse') return '\u27F2';
    if (card.type === 'draw2') return '+2';
    if (card.type === 'wild') return '\u2726';
    if (card.type === 'wild_draw4') return '+4';
    return '';
  });

  let bgColor = $derived(
    faceDown ? '#1a1a2e' : (card.color ? COLOR_HEX[card.color] : '#1a1a2e')
  );

  let isWild = $derived(card.type === 'wild' || card.type === 'wild_draw4');
</script>

<button
  class="card"
  class:face-down={faceDown}
  class:playable
  class:wild={isWild && !faceDown}
  style="--card-bg: {bgColor}"
  onclick={onclick}
  disabled={!playable && !faceDown}
>
  {#if faceDown}
    <div class="card-back">
      <span class="back-text">UNO</span>
    </div>
  {:else}
    <span class="card-value-small top-left">{displayValue()}</span>
    <span class="card-value-center">{displayValue()}</span>
    <span class="card-value-small bottom-right">{displayValue()}</span>
  {/if}
</button>

<style>
  .card {
    --card-width: 80px;
    --card-height: 120px;
    width: var(--card-width);
    height: var(--card-height);
    border-radius: 10px;
    background: var(--card-bg);
    border: 3px solid #fff;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Arial Black', Arial, sans-serif;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    transition: transform 0.2s, box-shadow 0.2s;
    padding: 0;
    flex-shrink: 0;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 40%;
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(15deg);
    pointer-events: none;
  }

  .card.playable {
    cursor: pointer;
    box-shadow: 0 0 12px 3px rgba(255, 255, 100, 0.7);
  }

  .card.playable:hover {
    transform: translateY(-16px) scale(1.05);
    box-shadow: 0 0 20px 5px rgba(255, 255, 100, 0.9);
  }

  .card.face-down {
    cursor: default;
  }

  .card.wild {
    background: linear-gradient(135deg, #ED1C24 25%, #FFDE00 25%, #FFDE00 50%, #00A651 50%, #00A651 75%, #0072BC 75%) !important;
  }

  .card-value-center {
    font-size: 2rem;
    z-index: 1;
  }

  .card-value-small {
    position: absolute;
    font-size: 0.75rem;
    z-index: 1;
  }

  .top-left {
    top: 6px;
    left: 8px;
  }

  .bottom-right {
    bottom: 6px;
    right: 8px;
    transform: rotate(180deg);
  }

  .card-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at center, #2d2d5e 0%, #1a1a2e 100%);
    border-radius: 7px;
  }

  .back-text {
    font-size: 1.1rem;
    font-weight: 900;
    color: #ff4444;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.6);
  }
</style>
