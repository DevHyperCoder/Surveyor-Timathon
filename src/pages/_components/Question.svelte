<script lang="ts">
  import type { IQuestion } from "../../types/IQuestion";

  let text: string | number;
  export let answer: number | string;
  export let questionText: string | number;
  export let question: IQuestion;
  export let isAnswering: boolean = true;
  export let onEdit:
    | undefined
    | ((question: IQuestion, isAnswering: boolean) => any);
  export let onAnswer: undefined | ((text: string | number) => any);

  console.log(questionText, answer);

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
  $: {
    text;
    if (isAnswering) {
      onAnswer(text);
    }
  }

  $: {
    if (question) {
      question.type;
      if (question.type === "mcq" && question.option === undefined) {
        question.option = [];
      }
    }
  }
</script>

<style>
  .question {
    width: 90%;
    background-color: aliceblue;
    color: black;
    margin: 1rem;
    border-radius: 10px 10px 10px 10px;
    padding: 0.8rem;
  }
</style>

<template>
  <div class="question">
    <!-- Remove editing -->
    {#if isAnswering}
      <!-- Question text -->
      <h2>{question.text}</h2>

      <!-- Render input fields based on types -->
      {#if question.type === 'sh-a'}
        <input
          required={question.isRequired}
          bind:value={text}
          type="text"
          maxlength={100}
          id={question.id} />
      {:else if question.type === 'p'}
        <input
          required={question.isRequired}
          bind:value={text}
          type="text"
          id={question.id} />
      {:else if question.type === 'num'}
        <input
          required={question.isRequired}
          bind:value={text}
          type="number"
          id={question.id} />
      {:else if question.type === 'mcq'}
        {#if question.option === undefined || question.option.length <= 0}
          <p>Hmm... We seem to have a problem with this specific question..</p>
        {:else}
          <form action="">
            {#each question.option as option}
              <input
                required={question.isRequired}
                type="radio"
                value={option}
                bind:group={text} />
              <label for={option}>{option}</label>
            {/each}
          </form>
        {/if}
      {/if}
    {:else if answer || questionText}
      <h2>{questionText}</h2>
      <p>{answer}</p>
    {:else}
      Question text
      <!-- Choices -->
      <h2 contenteditable bind:textContent={question.text} />

      <!-- is required -->
      <label for="is-required-check">Is this question required?</label>
      <input
        id="is-required-check"
        type="checkbox"
        bind:checked={question.isRequired} />

      <select bind:value={question.type}>
        <option value="mcq" default>MCQ</option>
        <option value="sh-a">Short Answer</option>
        <option value="p">Paragraph</option>
        <option value="num">Number</option>
      </select>

      {#if question.type === 'mcq'}
        {#if question.option}
          {#each question.option as option}
            <input type="radio" id={option} value={option} />
            <label
              contenteditable="true"
              for={option}
              bind:textContent={option}>{option}</label>
          {/each}
        {/if}
        <button
          type="button"
          on:click={() => {
            question.option = [...question.option, 'asdf'];
          }}>New option</button>
      {/if}
    {/if}
  </div>
</template>
