<script lang="ts">
  interface Props {
    count: number;
    canDraw: boolean;
    ondraw: () => void;
  }

  let { count, canDraw, ondraw }: Props = $props();
</script>

<div class="draw-pile">
  <div class="label bangers-font">DRAW ({count})</div>
  <button
    class="draw-card"
    class:can-draw={canDraw}
    onclick={ondraw}
    disabled={!canDraw}
  >
    <div class="card-inner">
      <div class="card-back">
        <span class="back-text">NO U!</span>
      </div>
    </div>
    <!-- Stack effect -->
    <div class="stack stack-1"></div>
    <div class="stack stack-2"></div>
    <div class="stack stack-3"></div>
  </button>
</div>

<style>
  .draw-pile {
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
    transform: rotate(-3deg);
  }

  .draw-card {
    position: relative;
    width: 90px;
    height: 135px;
    background: var(--uno-white);
    border: var(--border-thick);
    box-shadow: 4px 4px 0px var(--uno-black);
    cursor: default;
    padding: 6px;
    transition: transform 0.1s;
  }

  .draw-card .card-inner {
    width: 100%;
    height: 100%;
    background: var(--uno-black);
    border: 2px solid var(--uno-black);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

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
    font-family: 'Bangers', cursive;
    font-size: 1.5rem;
    color: var(--uno-red);
    text-shadow: 2px 2px 0px var(--uno-yellow);
    transform: rotate(-10deg);
    padding: 2px 6px;
    background: var(--uno-black);
    border: 2px solid var(--uno-yellow);
  }

  .stack {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--uno-white);
    border: var(--border-thick);
    z-index: 1;
  }

  .stack-1 { top: 4px; left: 4px; z-index: 1; background: var(--uno-blue); }
  .stack-2 { top: 8px; left: 8px; z-index: 0; background: var(--uno-yellow); }
  .stack-3 { top: 12px; left: 12px; z-index: -1; background: var(--uno-black); }

  .draw-card.can-draw {
    cursor: pointer;
  }

  .draw-card.can-draw:hover {
    transform: translate(-4px, -4px);
  }

  .draw-card.can-draw:active {
    transform: translate(2px, 2px);
  }
</style>

