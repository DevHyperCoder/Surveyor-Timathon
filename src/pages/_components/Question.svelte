<script lang="ts">
  import type { IQuestion } from "../../types/IQuestion";

  export let question: IQuestion;
  export let isAnswering: boolean = true;
  export let onEdit:
    | undefined
    | ((question: IQuestion, isAnswering: boolean) => any);
  export let onAnswer: undefined | ((text: string | number) => any);

  let timer: number;
  $: {
    question;
    debounceInput(question);
  }

  function debounceInput(question: IQuestion) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      onEdit(question, isAnswering);
    }, 750);
  }
  let text: string | number;
  $: {
    text;
    if (isAnswering) {
      onAnswer(text);
    }
  }
</script>

<template>
  <div class="question">
    <!-- Remove editing -->
    {#if isAnswering}
      <!-- Question text -->
      <h2>{question.text}</h2>

      <!-- Render input fields based on types -->
      {#if question.type === 'sh-a'}
        <input bind:value={text} type="text" maxlength={100} id={question.id} />
      {:else if question.type === 'p'}
        <input bind:value={text} type="text" id={question.id} />
      {:else if question.type === 'num'}
        <input bind:value={text} type="number" id={question.id} />
        <!-- {:else if question.type ==="mcq"}
        <select name="" id={`mcq-${question.id}`}>
          {#if  question.option === undefined ||question.option.length <=0 }
            <p>Hmm... We seem to have a problem with this specific question..</p>
            {:else}
          {#each question.option as option}
            <option value={option}>{option}</option>
          {/each}
          {/if}

        </select> -->
      {/if}
    {:else}
      <!-- Question text -->
      <h2 contenteditable bind:textContent={question.text} />

      <!-- Choices -->
      <select bind:value={question.type}>
        <option value="mcq" default>MCQ</option>
        <option value="sh-a">Short Answer</option>
        <option value="p">Paragraph</option>
        <option value="num">Number</option>
      </select>
    {/if}
  </div>
</template>
