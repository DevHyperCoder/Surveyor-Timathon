<script lang="typescript">
  import { user } from "../../store";
  import { db,auth } from "../../firebase";

  import { params, redirect } from "@sveltech/routify";
  import type { IQuestion } from "../../types/IQuestion";
  import type { IAnswer, IResponse } from "../../types/IAnswer";
  import Question from "../_components/Question.svelte";
import { formatQuestionObj } from "../../DB/Survey";
  let userObj: firebase.User = auth.currentUser;
  user.subscribe((u) => (userObj = u));

  const { id } = $params;
  let questions: IQuestion[] = [];
  let surveyDocData: firebase.firestore.DocumentData;

  let answers: Map<string, string | number> = new Map();

  $: {
    answers;
    console.log(answers);
  }

  getSurveyDocument();

  async function getSurveyDocument() {
    const surveyDoc = await db.collection("surveys").doc(id).get();
    if (surveyDoc.exists) {
      surveyDocData = surveyDoc.data();
      const surveyQuestions = await db
        .collection(`surveys/${id}/questions`)
        .get();

      surveyQuestions.docs.forEach((surveyQuestion) => {
        const q = surveyQuestion.data() as IQuestion;
        questions = [...questions, q];
      });
    }
  }

  function handleAnswer(id: string, text: string | number) {
    console.log(id, text);
    // Check if ans already exist in array
    if (answers.has(id)) {
      answers.delete(id);
    }

    answers.set(id, text);
    answers = answers;
  }

  function getAnswers() {
    const answersList: IAnswer[] = [];
    answers.forEach((a, key) => {
      if(!a){a=""}
      answersList.push({
        questionId: key,
        answerText: a,
      });
    });
    return answersList;
  }
  let userId: string;

  user.subscribe((u) => {
    userObj = u;
    if (userObj && !userObj.isAnonymous) userId = userObj.displayName;
  });

  let userName: string;
  $: {
    userName;
    if (!userObj||userObj.isAnonymous) {
      userId = userName;
    }
  }


  function submitSurvey() {
    // Create a IResponse Obj
    const response: IResponse = {
      surveyId: id,
      userId,
      answers: getAnswers(),
    };

    db.collection("responses").add(response);
    $redirect("/success")
  }

  function canAnswer(userObj, surveyDocData) {
    if (!userObj || !surveyDocData) {
      return true;
    }

    return userObj.email !== surveyDocData.created_by;
  }

  function handleEdit(question: IQuestion) {
    const surveyCollectionRef = db.collection("surveys");
    try {
      surveyCollectionRef
        .doc(id)
        .collection("questions")
        .doc(question.id)
        .set(formatQuestionObj(question), { merge: true });
    } catch (error) {
      console.error(error);
    }
  }






</script>

<style>
  div {
    width: 50%;
    margin: auto;
  }
  a {
    text-decoration: none;
    color: white;
    margin: 1rem;
    padding: 0.5rem;
    background-color: black;
  }
</style>

<template>
  <div class="">
    {#if surveyDocData}
      <h2>{surveyDocData.surveyTitle}</h2>
    {/if}
    {#await questions}
      <p>loading</p>
    {:then questions}
      {#each questions as question}
        <Question
          onAnswer={(text) => handleAnswer(question.id, text)}
          onEdit={(q)=> handleEdit(q)}
          {question}
          isAnswering={canAnswer(userObj, surveyDocData)} />
      {/each}
      {#if canAnswer(userObj, surveyDocData)}
        {#if !userObj ||userObj.isAnonymous}
          <input
            type="text"
            required={true}
            placeholder="Enter your name"
            bind:value={userName} />
        {/if}
        <button on:click={submitSurvey} type="submit">Submit this quiz</button>
      {:else}
        <p>edit func would be don</p>
        <a href={`/response/${id}`}>See responses</a>
      {/if}
    {/await}
  </div>
</template>
