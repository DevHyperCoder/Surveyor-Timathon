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
  export let onDelete: undefined | ((id: string) => any);

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
    width: 100%;
    background-color: var(--white);
    color: var(--black);
    margin: 1rem 0;
    border-radius: 30px;
    padding: 0.8rem;
    box-shadow: 2px 2px 2px #ccc;
  }
  h2 {
    margin-bottom: 0.8rem;
  }

  #q-text {
    font-weight: 500;
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
    display: block;
  }

  .question * {
    margin-bottom: 0.2rem;
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
              <div>
                <input
                  required={question.isRequired}
                  type="radio"
                  value={option}
                  bind:group={text} />
                <label for={option}>{option}</label>
              </div>
            {/each}
          </form>
        {/if}
      {/if}
    {:else if answer || questionText}
      <h2>{questionText}</h2>
      <p>{answer}</p>
    {:else}
      <!-- Choices -->
      <input
        id="q-text"
        bind:value={question.text}
        placeholder={question.text ? '' : 'Question Text'} />
      <select bind:value={question.type}>
        <option value="mcq" default>MCQ</option>
        <option value="sh-a">Short Answer</option>
        <option value="p">Paragraph</option>
        <option value="num">Number</option>
      </select>

      <!-- is required -->
      <div id="required">
        <label for="is-required-check">Is this question required?</label>
        <input
          id="is-required-check"
          type="checkbox"
          bind:checked={question.isRequired} />
      </div>

      {#if question.type === 'mcq'}
        {#if question.option}
          <form>
            {#each question.option as option}
              <div>
                <input type="radio" id={option} disabled value={option} />
                <label
                  contenteditable="true"
                  for={option}
                  bind:textContent={option}>{option}</label>
              </div>
            {/each}
          </form>
        {/if}

        <svg
          on:click={() => {
            question.option = [...question.option, 'Option'];
          }}
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-node-plus"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM11 5a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 11 5zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z" />
        </svg>
      {/if}

      <svg
        on:click={() => onDelete(question.id)}
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        class="bi bi-trash-fill"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
      </svg>
    {/if}
  </div>
</template>
