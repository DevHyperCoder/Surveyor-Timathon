<script lang="ts">
  // Types
  import type { IQuestion } from "../types/IQuestion";
  // Question component
  import Question from "./_components/Question.svelte";
  // Firestore
  import { db } from "../firebase";

  // User store
  import { user } from "../store";
  import { redirect } from "@sveltech/routify";

  let questions: IQuestion[] = [];

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  // Redirect to home page if user is not signed in
  if (!userObj) {
    $redirect("/");
  }

  // State
  let surveyTitle: string;
  let description: string;
  let surveyId: string;
  let updateTitleCall: boolean;

  // Reactive state
  $: {
    surveyTitle;
    updateTitle(surveyTitle);
  }

  $: {
    description;
    updateDescription(description);
  }

  async function updateDescription(description: string) {
    if (surveyId) {
      await db
        .collection("surveys")
        .doc(surveyId)
        .set({ description }, { merge: true });

      return;
    }
  }

  async function updateTitle(surveyTitle: string) {
    if (surveyId) {
      updateTitleCall = false;
      db.collection("surveys")
        .doc(surveyId)
        .set({ surveyTitle }, { merge: true });
      return;
    }
    updateTitleCall = true;
  }
  async function addToQuestionList() {
    // Create a new survey if it does not exist
    if (!surveyId) {
      const newSurvey = await db.collection("surveys").add({
        created_by: userObj.email,
      });
      surveyId = newSurvey.id;
      if (updateTitleCall) {
        updateTitle(surveyTitle);
      }
    }

    // Add the question to the list
    let arrlen = questions.length.toString();
    questions = [
      ...questions,
      { type: "p", text: "", id: arrlen, isRequired: true },
    ];
  }

  function handleEdit(question: IQuestion) {
    const surveyCollectionRef = db.collection("surveys");
    try {
      surveyCollectionRef
        .doc(surveyId)
        .collection("questions")
        .doc(question.id)
        .set(formatQuestionObj(question), { merge: true });
    } catch (error) {
      console.error(error);
    }
  }

  function formatQuestionObj(q: IQuestion): IQuestion {
    if (q.option === undefined) {
      return {
        type: q.type,
        text: q.text,
        id: q.id,
        isRequired: q.isRequired,
      };
    }
    return q;
  }

  async function onDelete(qID: string) {
    const ID = +qID;
    if (ID < 0 || ID > questions.length) {
      return;
    }

    let question = questions[ID];
    questions.splice(ID, 1);

    // delete from firebase
    const surveyCollectionRef = db.collection("surveys");
    try {
      await surveyCollectionRef
        .doc(surveyId)
        .collection("questions")
        .doc(question.id)
        .delete();
    } catch (error) {
      console.error(error);
    }

    questions = questions;
  }
</script>

<style>
  button,
  a {
    background-color: var(--primary-purple);
    padding: 1rem 2rem 1rem;
    margin-top: 1rem;
    color: var(--black);
  }
  a {
    text-decoration: none;
  }
  article {
    background-color: var(--white);
    border-radius: 30px;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  article input {
    display: block;
  }
  #s-title {
    font-size: 1.3rem;
    font-weight: 500;
  }
  #s-desc {
    font-size: 1.2rem;
    font-weight: 500;
  }
</style>

<template>
  <article>
    <input
      id="s-title"
      bind:value={surveyTitle}
      type="text"
      placeholder={surveyTitle ? '' : 'Survey Title'} />
    <input
      id="s-desc"
      type="text"
      placeholder={description ? '' : 'Survey Description'}
      bind:value={description} />
  </article>

  <!-- FOR EACH LOOP -->
  {#if questions}
    {#each questions as question}
      <Question
        onEdit={(q) => handleEdit(q)}
        isAnswering={false}
        onDelete={(id) => onDelete(id)}
        {question} />
    {/each}
  {:else}
    <p>Create a new question!</p>
  {/if}
  <button on:click={addToQuestionList}>+</button>
  <a target="_blank" href={`/view/${surveyId}`}>Share this survey with others
  </a>
  <p>Survey Code:</p>
  <code>{surveyId}</code>
</template>
