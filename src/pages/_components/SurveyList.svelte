<script lang="ts">
  import type { ISurveyList } from "../../types/ISurvey";
  import Survey from "./Survey.svelte";
  export let surveys: ISurveyList[];
  export let template: boolean = false;
  export let showTemplateBtn;
  export let newSurveyId;
  export let onUseButtonClick;
  
</script>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    margin-top: 0.8rem;
  }

  @media screen and (max-width: 460px) {
    div {
      grid-template-columns: 1fr;
    }
  }
</style>

<template>
  <div>
    {#each surveys as survey}
      <Survey
        {template}
        {survey}
        {showTemplateBtn}
        {newSurveyId}
        {onUseButtonClick} />
    {/each}
  </div>
</template>
