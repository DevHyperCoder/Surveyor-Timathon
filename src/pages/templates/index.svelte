<script lang="ts">
  import { user } from "../../store";
  import { db } from "../../firebase";
  import type { ISurveyList } from "../../types/ISurvey";
  import SurveyList from "../_components/SurveyList.svelte";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  let templates: Promise<ISurveyList[]> = getTemplates();

  let newSurveyId: string;

  let templateBtnStatus = { id: "", show: false };

  $: {
    userObj;
    if (userObj) {
      templates = getTemplates();
    }
  }

  async function getTemplates() {
    let templates: ISurveyList[] = [];
    if (!userObj) return;

    const templateList = await db
      .collection("templates")
      .doc(userObj.uid)
      .get();

    const templatesData: { surveys: ISurveyList[] } = templateList.data() as {
      surveys: ISurveyList[];
    };

    templatesData.surveys.forEach((template) => {
      templates.push(template);
    });

    return templates;
  }

  async function makeNewSurveyWithTemplate(id: string) {
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

    templateBtnStatus = { id: id, show: true };
  }
</script>

<style>
</style>

<template>
  <h1>Your templates</h1>
  {#await templates}
    <p>loading your templates</p>
  {:then templates}
    <SurveyList
      {templateBtnStatus}
      onUseButtonClick={makeNewSurveyWithTemplate}
      surveys={templates}
      {newSurveyId}
      template={true} />
  {:catch}
    <p>Hmmm.... I guess we ran into a error?</p>
  {/await}
</template>
