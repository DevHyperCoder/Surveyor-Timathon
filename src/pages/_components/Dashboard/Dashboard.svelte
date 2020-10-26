<script lang="ts">
  import { user } from "../../../store";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  import { getSurveysByEmail, docListToSurveyList } from "../../../DB/Survey";

  let surveysOfCurrentUser = getAllSurveysOfCurrentUser();

  async function getAllSurveysOfCurrentUser() {
    const uEmail = userObj.email;
    if (uEmail === undefined || uEmail === "") {
      return undefined;
    }
    const docs = await getSurveysByEmail(uEmail);
    return docListToSurveyList(docs);
  }
  async function showAllSurveys() {
    const uEmail = userObj.email;
    if (uEmail === undefined || uEmail === "") {
      return undefined;
    }
    const docs = await getSurveysByEmail(uEmail, -1);

    return docListToSurveyList(docs);
  }
</script>

<style>
</style>

<template>
  <p>Hi! {userObj.displayName}</p>
  {#await surveysOfCurrentUser}
    <p>getting ur surveys!!</p>
  {:then surveys}
    {#each surveys as survey}
      <p>{survey.surveyTitle}</p>
      <a href={`/view/${survey.surveyId}`}>go to survey</a>
    {/each}
    <button on:click={() => (surveysOfCurrentUser = showAllSurveys())}>Show all
      surveys that you have</button>
  {/await}
</template>
