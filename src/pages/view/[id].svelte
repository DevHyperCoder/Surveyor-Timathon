<script lang="typescript">

  import { user } from "../../store";
  import { db } from "../../firebase";

  import { params } from "@sveltech/routify";
  import type { IQuestion } from "../../types/IQuestion";
  import type { IAnswer, IResponse } from "../../types/IAnswer";
  import Question from "../_components/Question.svelte";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  const { id } = $params;
  let questions: IQuestion[] = [];
  let surveyTitle: string;
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
      answersList.push({
        questionId: key,
        answerText: a,
      });
    });
    return answersList;
  }


  function submitSurvey() {
    // Create a IResponse Obj
    const response: IResponse = {
      surveyId: id,
      userId: "",
      answers: getAnswers(),
    };

    db.collection("responses").add(response);
  }

  function canAnswer(userObj, surveyDocData) {
    if (!userObj || !surveyDocData) {
      return true;
    }

    return userObj.email !== surveyDocData.created_by;
  }
</script>

<style>
</style>

<template>
  {#await questions}
    <p>loading</p>
  {:then questions}
    {#each questions as question}
      <Question
        onAnswer={(text) => handleAnswer(question.id, text)}
        {question}
        isAnswering={canAnswer(userObj, surveyDocData)} />
    {/each}
    {#if canAnswer(userObj, surveyDocData)}
      <button on:click={submitSurvey} type="submit">Submit this quiz</button>
    {:else}edit func would be done <a href={`/response/${id}`}>See responses</a>{/if}
  {/await}
</template>
