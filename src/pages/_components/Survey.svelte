<script lang="ts">
  import type { ISurveyList } from "../../types/ISurvey";
  export let template: boolean = false;
  export let onUseButtonClick: ((id: string) => any) | undefined;
  export let survey: ISurveyList;
  export let showTemplateBtn: { id: string; show: boolean };
  export let newSurveyId: string;
</script>

<style>
  p {
    font-weight: 500;
  }
  a {
    color: var(--black);
    text-decoration: none;
  }
  article {
    width: 100%;
    border-radius: 15px;
    background: var(--white);
    padding: 0.8rem;
    box-shadow: 2px 2px 2px #ccc;
  }
</style>

<template>
  <article>
    <p>{survey.surveyTitle}</p>
    {#if template}
      <button on:click={() => onUseButtonClick(survey.surveyId)}>Use this
        template</button>
      {#if showTemplateBtn.id === survey.surveyId && showTemplateBtn.show === true}
        <a href={`/view/${newSurveyId}`}>Go to new survey</a>
      {/if}
    {:else}<a href={`/view/${survey.surveyId}`}>go to survey</a>{/if}
  </article>
</template>
