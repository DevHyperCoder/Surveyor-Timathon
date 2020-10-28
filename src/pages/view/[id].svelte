<script lang="typescript">
  import { user } from "../../store";
  import { db, auth } from "../../firebase";

  import { params, redirect } from "@sveltech/routify";
  import type { IQuestion } from "../../types/IQuestion";
  import type { IAnswer, IResponse } from "../../types/IAnswer";
  import Question from "../_components/Question.svelte";
  import { formatQuestionObj } from "../../DB/Survey";
  import { async } from "rxjs";
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
      oldTitle = surveyDocData.surveyTitle;
      oldDescription = surveyDocData.description;
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
      if (!a) {
        a = "";
      }
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
    if (!userObj || userObj.isAnonymous) {
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
    $redirect("/success");
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

  function addToQuestionList() {
    console.log("addToQuestionList");
    let arrlen = questions.length.toString();
    questions = [
      ...questions,
      { type: "p", text: "", id: arrlen, isRequired: true },
    ];
  }
  async function updateTitle(surveyTitle: string) {
    console.log(id, surveyTitle);
    if (id) {
      db.collection("surveys").doc(id).set({ surveyTitle }, { merge: true });
      return;
    }
  }

  async function updateDescription(description: string) {
    if (id) {
      db.collection("surveys").doc(id).set({ description }, { merge: true });
      return;
    }
  }

  let oldTitle: string, oldDescription: string;

  $: {
    surveyDocData;
    if (surveyDocData) {
      if (surveyDocData.surveyTitle != oldTitle) {
        updateTitle(surveyDocData.surveyTitle);
      }
      if (surveyDocData.desc != oldDescription) {
        updateDescription(surveyDocData.description);
      }
    }
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
        .doc(id)
        .collection("questions")
        .doc(question.id)
        .delete();
    } catch (error) {
      console.error(error);
    }

    questions = questions;
  }

  import { firestore } from "firebase/app";

  async function makeToTemplate() {
    console.log(id);
    const shouldAddToTemplate = confirm("Sure? adding it to ur templates list");
    if (!shouldAddToTemplate) {
      return;
    }
let title = surveyDocData.surveyTitle

console.log(id,title);


    // Firebase call
    await db
      .collection("templates")
      .doc(userObj.uid)
      .set({
        surveys: firestore.FieldValue.arrayUnion({id,title}),
      },{merge:true});
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
      {#if !canAnswer(userObj, surveyDocData)}
        <h2
          contenteditable="true"
          bind:textContent={surveyDocData.surveyTitle} />
        <p
          contenteditable="true"
          bind:textContent={surveyDocData.description} />
      {:else}
        <h2>{surveyDocData.surveyTitle}</h2>
        <p>{surveyDocData.description}</p>
      {/if}
    {/if}
    {#await questions}
      <p>loading</p>
    {:then questions}
      <form>
        {#each questions as question}
          <Question
            onAnswer={(text) => handleAnswer(question.id, text)}
            onEdit={(q) => handleEdit(q)}
            onDelete={(id) => onDelete(id)}
            {question}
            isAnswering={canAnswer(userObj, surveyDocData)} />
        {/each}
        {#if canAnswer(userObj, surveyDocData)}
          {#if !userObj || userObj.isAnonymous}
            <input
              type="text"
              required={true}
              placeholder="Enter your name"
              bind:value={userName} />
          {/if}
          <button on:click={submitSurvey} type="submit">Submit this quiz</button>
        {:else}
          <button on:click={addToQuestionList} type="button">New question</button>
          <a href={`/response/${id}`}>See responses</a>
          {#if userObj}
            <button on:click={() => makeToTemplate()} type="button">Make to
              templates</button>
          {/if}
        {/if}
      </form>
    {/await}
  </div>
</template>
