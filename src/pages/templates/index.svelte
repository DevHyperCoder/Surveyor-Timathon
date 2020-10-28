<script lang="ts">
  import { user } from "../../store";
  import { db } from "../../firebase";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  $: {
    userObj;
    if (userObj) {
      templates = getTemplates();
    }
  }

  let templates: Promise<ITemplate[]> = getTemplates();
 
  let newSurveyId:string;

  let showTemplateBtn = { id: "", show: false };


  interface ITemplate {
    title: string;
    id: string;
  }

  async function getTemplates() {
    let templates: ITemplate[] = [];
    if (!userObj) return;
    console.log(`Getting all templates`);
    const templateList = await db
      .collection("templates")
      .doc(userObj.uid)
      .get();
    const templatesData: { surveys: ITemplate[] } = templateList.data() as {
      surveys: ITemplate[];
    };

    templatesData.surveys.forEach((template) => {
      templates.push(template);
    });

    return templates;
  }
  
   async function makeNewSurveyWithTemplate(id: string, title: string) {
    const survey = await db.collection("surveys").add({
      created_by: userObj.email,
    });
    newSurveyId = survey.id;
    const newQuestions = [];
    const surveyQuestions = await db
      .collection("surveys")
      .doc(id)
      .collection("questions")
      .get();
    surveyQuestions.forEach((a) => {
      const id = a.id;
      const question = a.data();
      newQuestions.push({ id, question });
    });
    for (let index = 0; index < newQuestions.length; index++) {
      const { id, question } = newQuestions[index];

      await db
        .collection("surveys")
        .doc(newSurveyId)
        .collection("questions")
        .doc(id)
        .set(question, { merge: true });
    }
    showTemplateBtn = { id: id, show: true };
  }
</script>

<style>
</style>

<template>
  <h1>Your templates</h1>
  {#await templates}
    <p>loading your templates</p>
  {:then templates}
    {#each templates as template}
      <p>{template.id}</p>
      <p>{template.title}</p>
      <button
        on:click={() => makeNewSurveyWithTemplate(template.id, template.title)}>Use
        this template</button>
      {#if showTemplateBtn.id === template.id && showTemplateBtn.show === true}
        <a href={`/view/${newSurveyId}`}>Go to new survey</a>
      {/if}
    {/each}
  {:catch}
    <p>Hmmm.... I guess we ran into a error?</p>
  {/await}
</template>
