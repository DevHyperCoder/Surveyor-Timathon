<script lang="ts">
  // Types
  import type { IQuestion } from "../types/IQuestion";
  // Question component
  import Question from "./_components/Question.svelte";
  // Firestore
  import { db } from "../firebase";

  // User store
  import { user } from "../store";

  let questions: IQuestion[] = [];

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  // State
  let surveyTitle: string;
  let surveyId: string;

  $: {
    surveyTitle;
    console.log(surveyTitle);
    updateTitle(surveyTitle);
  }
  let updateTitleCall;
  async function updateTitle(surveyTitle: string) {
    console.log(surveyId, surveyTitle);
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
  button {
    background-color: var(--primary-purple);
    padding: 1rem 2rem 1rem;
    margin-top: 1rem;
    color: var(--black);
  }
  a {
    color: var(--black);
    text-decoration: none;
  }

</style>

<template>
    <div class="title-container">
      <label for="survey-title">Title</label>
      <input bind:value={surveyTitle} type="text" id="survey-title" />
    </div>

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
</template>
