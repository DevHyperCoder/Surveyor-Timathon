<script lang="ts">
  export let onClick: svelte.JSX.EventHandler<MouseEvent, HTMLButtonElement>;
  export let value!: string;
  export let id: string;
  export let Class: string;
</script>

<style>
  button {
    background-color: var(--primary-purple);
    color: var(--primary-font-color);
    font-size: 1.5rem;
    padding: 1rem;
    border-radius: 2rem;
    text-align: center;
    display: block;
  }
  .cta {
    font-size: 3rem;
    font-weight: 600;
    margin: auto;
    margin-top: 5rem;
  }
  .google {
    background-color: #4285f4;
  }
</style>

<template>
  <button {id} class={Class} on:click={onClick}>{value}</button>
</template>
