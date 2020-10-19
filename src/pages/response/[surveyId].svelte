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

  let responseDoc: Promise<
    firebase.firestore.DocumentData[]
  > = getResponseDocument(surveyId);
  let isLoad: Promise<[{ Q: IQuestion; A: IAnswer }]>;
  $: {
    id;
    isLoad = getQnAPair(id);
  }

  async function getQnAPair(id: string) {
    const questions = await getSurveyQuestions(surveyId);
    const reposone = await getResponse(id);
    const responseView = [];
    questions.forEach((q, i) => {
      responseView.push({
        Q: q,
        A: reposone.answers[i],
      });
    });
    return responseView as [{ Q: IQuestion; A: IAnswer }];
  }

  async function getResponseDocument(surveyId: string) {
    const docs = await db
      .collection("responses")
      .where("surveyId", "==", surveyId)
      .get();

    return docListTo(docs);
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

<template>
  {#if id}
    {#await isLoad then responseViewas}
      {#each responseViewas as a}
        <p>{a.Q.text}</p>
        <p>{a.A.answerText}</p>
      {/each}
    {/await}
  {:else}
    {#await responseDoc}
      <p>Loading respose</p>
    {:then docList}
      {#if !docList}
        <p>Seems no responses</p>
      {:else}
        {#each docList as doc}
          <button
            on:click={() => {
              $redirect(`/response/${surveyId}?id=${doc.docId}`);
              id = doc.docId;
            }}>{doc.data.userId || 'UNKNOWN'}</button>
        {/each}
      {/if}
    {/await}
  {/if}
</template>
