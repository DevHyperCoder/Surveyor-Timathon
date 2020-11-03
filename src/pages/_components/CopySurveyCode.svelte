<script lang="ts">
  export let id: string;
</script>

<style>
  article {
    padding: 0.8rem;
    background: var(--white);
    margin-top: 2rem;
    border-radius: 20px;
  }
</style>

<template>
  <article>
    <p>Survey Code:</p>
    <code>{id}</code>
  </article>
</template>
