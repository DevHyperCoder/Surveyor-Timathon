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
      updateTitleCall=false
      db.collection("surveys")
        .doc(surveyId)
        .set({ surveyTitle }, { merge: true });
        return
    }
    updateTitleCall = true
  }
  async function addToQuestionList() {
    // Create a new survey if it does not exist
    if (!surveyId) {
      const newSurvey = await db.collection("surveys").add({
        created_by: userObj.email,
      });
      surveyId = newSurvey.id;
      if (updateTitleCall){
        updateTitle(surveyTitle)

      }
    }
    let arrlen = questions.length.toString();
    questions = [...questions, { type: "p", text: "", id: arrlen }];
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

  function formatQuestionObj(q: IQuestion) {
    if (q.option === undefined) {
      return {
        type: q.type,
        text: q.text,
        id: q.id,
      };
    }
    return q
  }
</script>

<style>
  button {
    background-color: black;
    padding: 1rem 2rem 1rem;
    margin-top: 1rem;
    color: white;
  }
  #center {
    width: 50%;
    margin: auto;
  }

  a{
    color:white;
    text-decoration: none;
  }
</style>

<template>
  <div id="center">
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
          {question} />
      {/each}
    {:else}
      <p>Create a new question!</p>
    {/if}
    <button on:click={addToQuestionList}>+</button>
    <a target="_blank" href={`/view/${surveyId}`}>Share this survey with others </a>
  </div>
</template>
