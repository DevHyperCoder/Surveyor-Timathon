<script lang="ts">
  let surveyID: string;

  import { redirect } from "@sveltech/routify";

  function redirectToViewPage() {
    $redirect(`view/${surveyID}`);
  }
</script>

<style>
  input {
    display: block;
    width: 100%;
    padding: 0.2rem;
    font-size: 1.3rem;
  }

  button {
    padding: 0.8rem;
    background-color: var(--primary-purple);
    font-size: 1.5rem;
    border-radius: 0.2rem;
  }
  article {
    background: var(--white);
    border-radius: 1.2rem;
    margin: 1rem 0;
    padding: 0.8rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 400;
  }

  input {
    margin-top: 1px;
  }

  button {
    background: var(--primary-purple);
    padding: 0.8rem;
    margin-top: 1rem;
    font-weight: 600;
    font-style: 1.3rem;
  }
</style>

<template>
  <article>
    <h3>Have a survey code? Enter it here!</h3>
    <input
      type="text"
      bind:value={surveyID}
      placeholder={'Enter the survey code'} />
    <button
      on:click={() => {
        redirectToViewPage();
      }}>Go to Survey</button>
  </article>
</template>
