<script lang="typescript">
  import { params } from "@sveltech/routify";
  const { surveyId } = $params;
  let { id } = $params;
  import { getSurveyQuestions } from "../../DB/Survey";
  import { getResponse } from "../../DB/Response";

  import { redirect } from "@sveltech/routify";
  import { db } from "../../firebase";
  import type { IAnswer, IResponse } from "../../types/IAnswer";
  import type { IQuestion } from "../../types/IQuestion";
  import Question from "../_components/Question.svelte";

  let responseDoc: Promise<
    firebase.firestore.DocumentData[]
  > = getResponseDocument(surveyId);
  let isLoad: Promise<[{ Q: IQuestion; A: IAnswer }]>;
  $: {
    id;
    isLoad = getQnAPair(id);
  }

  import { user } from "../../store";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  async function getQnAPair(id: string) {
    const questions = await getSurveyQuestions(surveyId);
    const reposone = await getResponse(id);
    console.log(questions), reposone;

    const responseView = [];
    questions.forEach((q, i) => {
      responseView.push({
        Q: q,
        A: reposone.answers[i],
      });
    });

    return responseView as [{ Q: IQuestion; A: IAnswer }];
  }
  let error: string;
  async function getResponseDocument(surveyId: string) {
    const surveyDoc = await db.collection("surveys").doc(surveyId).get();
    if (!userObj) {
      error = "You need to be logged in";
      return;
    }
    if (surveyDoc.data().created_by == userObj.email) {
      try {
        const docs = await db
          .collection("responses")
          .where("surveyId", "==", surveyId)
          .get();
        return docListTo(docs);
      } catch (e) {
        console.error(e);
      }
    }
    error = "You are not permitted to view the responses";
    return;
  }

  function docListTo(
    docList: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) {
    let a = [];
    docList.forEach((d) => {
      a.push({
        docId: d.id,
        data: d.data(),
      });
    });
    return a;
  }
</script>

<style>
    
  div {
    width: 75%;
    margin: auto;
  }

@media screen and (max-width:1200px){
  div{
    width: 85%;
  }
}

@media screen and (max-width:750px){
  div{
    width: 95%;
  }
}
button{
background-color: var(--primary-purple);

  font-weight: 500;
  margin-top: 1rem;
  padding: .8rem;
  width: 100%;
}
.response-btn{
  background: var(--white);
  border-radius: 20px;
}

</style>

<template>
  {#if id}
    {#await isLoad then responseViewas}
      {#each responseViewas as a}
        {#if !a.A}
          <p>No Answer for this question :(</p>
        {:else}
          <Question
            isAnswering={false}
            questionText={a.Q.text}
            answer={a.A.answerText} />
        {/if}
      {/each}

      <button on:click={$redirect(`/response/${surveyId}`)}>View all responses</button>

    {/await}
  {:else}
    {#await responseDoc}
      <p>Loading respose</p>
    {:then docList}
      {#if !docList && userObj}
        <p>Seems no responses</p>
      {:else}
        {#each docList as doc}
          <button
          class="response-btn"
            on:click={() => {
              $redirect(`/response/${surveyId}?id=${doc.docId}`);
              id = doc.docId;
            }}>{doc.data.userId || 'UNKNOWN'}</button>
        {/each}
      {/if}
    {:catch a}
      <p>Sorry we ran into an error</p>
    {/await}
  {/if}
  {#if error}
    <p>{error}</p>
  {/if}
</template>
