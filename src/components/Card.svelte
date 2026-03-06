<script lang="ts">
  import type { Card } from '../lib/types';

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
    if (card.type === 'wild') return 'WILD';
    if (card.type === 'wild_draw4') return '+4';
    return '';
  });

  let colorVar = $derived(() => {
    if (faceDown) return 'var(--uno-black)';
    switch (card.color) {
      case 'red': return 'var(--uno-red)';
      case 'blue': return 'var(--uno-blue)';
      case 'green': return 'var(--uno-green)';
      case 'yellow': return 'var(--uno-yellow)';
      default: return 'var(--uno-black)';
    }
  });

  let isWild = $derived(card.type === 'wild' || card.type === 'wild_draw4');
</script>

<button
  class="card"
  class:face-down={faceDown}
  class:playable
  class:wild={isWild && !faceDown}
  style="--card-color: {colorVar()}"
  onclick={onclick}
  disabled={!playable && !faceDown}
>
  <div class="card-inner">
    {#if faceDown}
      <div class="card-back">
        <span class="back-text">NO U!</span>
      </div>
    {:else if isWild}
      <div class="wild-bg">
        <div class="wild-quad red"></div>
        <div class="wild-quad blue"></div>
        <div class="wild-quad green"></div>
        <div class="wild-quad yellow"></div>
      </div>
      <div class="card-center">
        <span class="card-value-center wild-text">{displayValue()}</span>
      </div>
    {:else}
      <div class="card-center">
        <span class="card-value-center">{displayValue()}</span>
      </div>
      <span class="card-value-small top-left">{displayValue()}</span>
      <span class="card-value-small bottom-right">{displayValue()}</span>
    {/if}
  </div>
</button>

<style>
  .card {
    --card-width: 90px;
    --card-height: 135px;
    width: var(--card-width);
    height: var(--card-height);
    background: var(--uno-white);
    border: var(--border-thick);
    box-shadow: 4px 4px 0px var(--uno-black);
    position: relative;
    cursor: default;
    padding: 6px;
    flex-shrink: 0;
    transition: transform 0.1s, box-shadow 0.1s;
    font-family: 'Bangers', cursive;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    background: var(--card-color);
    border: 2px solid var(--uno-black);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card-center {
    background: var(--uno-white);
    width: 85%;
    height: 60%;
    border-radius: 50%;
    transform: rotate(-15deg);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--uno-black);
    box-shadow: 2px 2px 0px var(--card-color), 4px 4px 0px var(--uno-black);
    z-index: 10;
  }

  .card.playable {
    cursor: pointer;
  }

  .card.playable:hover {
    transform: translateY(-16px) rotate(2deg);
    box-shadow: 8px 8px 0px var(--uno-black);
  }

  .card.playable:active {
    transform: translateY(-8px) rotate(1deg);
    box-shadow: 4px 4px 0px var(--uno-black);
  }

  .face-down .card-inner {
    background: var(--uno-black);
  }

  .card-value-center {
    font-size: 2.2rem;
    color: var(--card-color);
    text-shadow: 2px 2px 0px var(--uno-black);
    transform: rotate(15deg);
    -webkit-text-stroke: 1px var(--uno-black);
  }

  .wild-text {
    font-size: 1.8rem;
    color: var(--uno-white);
    text-shadow: 2px 2px 0px var(--uno-black);
  }

  .card-value-small {
    position: absolute;
    font-size: 1rem;
    color: var(--uno-white);
    -webkit-text-stroke: 1px var(--uno-black);
    text-shadow: 1px 1px 0px var(--uno-black);
    z-index: 11;
  }

  .top-left {
    top: 4px;
    left: 4px;
  }

  .bottom-right {
    bottom: 4px;
    right: 4px;
    transform: rotate(180deg);
  }

  .wild-bg {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .wild-quad {
    width: 100%;
    height: 100%;
  }
  .wild-quad.red { background: var(--uno-red); }
  .wild-quad.blue { background: var(--uno-blue); }
  .wild-quad.green { background: var(--uno-green); }
  .wild-quad.yellow { background: var(--uno-yellow); }

  .card-back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      45deg,
      var(--uno-black),
      var(--uno-black) 10px,
      #222 10px,
      #222 20px
    );
  }

  .back-text {
    font-size: 1.5rem;
    color: var(--uno-red);
    text-shadow: 2px 2px 0px var(--uno-yellow);
    transform: rotate(-10deg);
    padding: 2px 6px;
    background: var(--uno-black);
    border: 2px solid var(--uno-yellow);
  }
</style>

