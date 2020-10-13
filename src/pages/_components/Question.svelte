<script lang="ts">
  import type { IQuestion } from "../../types/IQuestion";

  export let question: IQuestion;
  export let onEdit: (question: IQuestion) => any;

  let timer: number;

  $: {
    question;
    debounceInput(question);
  }

  function debounceInput(question: IQuestion) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      onEdit(question);
    }, 750);
  }
</script>

<template>
  <div class="question">
    <h2 contenteditable bind:textContent={question.text}>
      {#if question.text}{question.text}{:else}{'Question'}{/if}
    </h2>
    <select bind:value={question.type}>
      <option value="mcq" default>MCQ</option>
      <option value="sh-a">Short Answer</option>
      <option value="p">Paragraph</option>
      <option value="num">Number</option>
    </select>
  </div>
</template>
