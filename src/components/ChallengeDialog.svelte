<script lang="ts">
  interface Props {
    playerName: string;
    onrespond: (challenge: boolean) => void;
  }

  let { playerName, onrespond }: Props = $props();
</script>

<div class="overlay">
  <div class="dialog brutalist-panel">
    <h3 class="bangers-font">{playerName} PLAYED +4!</h3>
    <p>Are they bluffing?!</p>
    <div class="actions">
      <button class="btn challenge bangers-font" onclick={() => onrespond(true)}>
        CHALLENGE!
      </button>
      <button class="btn accept bangers-font" onclick={() => onrespond(false)}>
        ACCEPT (+4)
      </button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 17, 17, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .dialog {
    max-width: 400px;
    text-align: center;
    transform: rotate(1deg);
    background: var(--uno-yellow);
  }

  h3 {
    color: var(--uno-red);
    margin: 0 0 10px;
    font-size: 2.5rem;
    text-shadow: 2px 2px 0px var(--uno-black);
  }

  p {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0 0 20px;
  }

  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }

  .btn {
    padding: 10px 20px;
    border: var(--border-thick);
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 4px 4px 0px var(--uno-black);
    transition: transform 0.1s, box-shadow 0.1s;
    color: var(--uno-white);
  }

  .btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--uno-black);
  }

  .btn:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px var(--uno-black);
  }

  .challenge {
    background: var(--uno-red);
    transform: rotate(-2deg);
  }

  .accept {
    background: var(--uno-black);
    transform: rotate(2deg);
  }
</style>

