<script lang="typescript">
  import { user } from "../../store";
  import { db, auth } from "../../firebase";

  import { params, redirect } from "@sveltech/routify";
  import type { IQuestion } from "../../types/IQuestion";
  import type { IAnswer, IResponse } from "../../types/IAnswer";
  import Question from "../_components/Question.svelte";
  import { formatQuestionObj } from "../../DB/Survey";

  import { firestore } from "firebase/app";
  import type { ISurveyList } from "../../types/ISurvey";
  import CopySurveyCode from "../_components/CopySurveyCode.svelte";

  let userObj: firebase.User = auth.currentUser;
  user.subscribe((u) => (userObj = u));

  const { id } = $params;
  let questions: IQuestion[] = [];
  let surveyDocData: firebase.firestore.DocumentData;

  let answers: Map<string, string | number> = new Map();

  let userName: string;
  let userId: string;

  let oldTitle: string, oldDescription: string;

  $: {
    surveyDocData;
    if (surveyDocData) {
      if (surveyDocData.surveyTitle != oldTitle) {
        updateTitle(surveyDocData.surveyTitle);
      }
      if (surveyDocData.description != oldDescription) {
        updateDescription(surveyDocData.description);
      }
    }
  }

  user.subscribe((u) => {
    userObj = u;
    if (userObj && !userObj.isAnonymous) userId = userObj.displayName;
  });

  $: {
    userName;
    if (!userObj || userObj.isAnonymous) {
      userId = userName;
    }
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

  async function makeToTemplate() {
    console.log(id);
    const shouldAddToTemplate = confirm("Sure? adding it to ur templates list");
    if (!shouldAddToTemplate) {
      return;
    }
    let title = surveyDocData.surveyTitle;

    const s: ISurveyList = {
      surveyTitle: title,
      surveyId: id,
    };

    // Firebase call
    await db
      .collection("templates")
      .doc(userObj.uid)
      .set(
        {
          surveys: firestore.FieldValue.arrayUnion(s),
        },
        { merge: true }
      );
  }
</script>

<style>
  a {
    text-decoration: none;
    color: white;
    margin: 1rem;
    padding: 0.5rem;
    background-color: black;
  }
  article {
    background-color: var(--white);
    border-radius: 30px;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    box-shadow: 2px 2px 2px #ccc;
  }
  article input {
    display: block;
    width: 100%;
  }
  #s-title {
    font-size: 1.3rem;
    font-weight: 500;
  }
  #s-desc {
    font-size: 1.2rem;
    font-weight: 500;
  }
  div {
    margin-top: 1.5rem;
  }
</style>

<template>
  <article>
    {#if surveyDocData}
      {#if !canAnswer(userObj, surveyDocData)}
        <input
          id="s-title"
          bind:value={surveyDocData.surveyTitle}
          type="text"
          placeholder={surveyDocData.surveyTitle ? '' : 'Survey Title'} />
        <input
          id="s-desc"
          type="text"
          placeholder={surveyDocData.description ? '' : 'Survey Description'}
          bind:value={surveyDocData.description} />
      {:else}
        <h2>{surveyDocData.surveyTitle}</h2>
        <p>{surveyDocData.description}</p>
      {/if}
    {/if}
  </article>
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
        <div>
          <svg
            on:click={addToQuestionList}
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            class="bi bi-plus-circle-fill"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>

          <a href={`/response/${id}`}>See responses</a>
        </div>
      {/if}

      {#if userObj}
        <svg
          width="1em"
          on:click={() => makeToTemplate()}
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-file-earmark-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0H4zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
        </svg>
      {/if}
    </form>
    <CopySurveyCode {id} />
  {/await}
</template>
