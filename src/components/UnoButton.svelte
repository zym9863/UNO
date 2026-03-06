<script lang="ts">
  interface Props {
    visible: boolean;
    onclick: () => void;
  }

  let { visible, onclick }: Props = $props();
</script>

{#if visible}
  <button class="uno-btn brutalist-button bangers-font" onclick={onclick}>
    UNO!
  </button>
{/if}

<style>
  .uno-btn {
    background: var(--uno-red);
    color: var(--uno-white);
    font-size: 2.5rem;
    padding: 10px 40px;
    border: var(--border-thick);
    cursor: pointer;
    box-shadow: 6px 6px 0px var(--uno-black);
    transition: transform 0.1s, box-shadow 0.1s;
    animation: pulse 1s infinite alternate;
    position: absolute;
    bottom: 250px;
    right: 50px;
    transform: rotate(-10deg);
    z-index: 50;
  }

  .uno-btn:hover {
    transform: rotate(-10deg) translate(-2px, -2px) scale(1.1);
    box-shadow: 10px 10px 0px var(--uno-black);
  }

  @keyframes pulse {
    from { color: var(--uno-yellow); }
    to { color: var(--uno-white); }
  }
</style>

