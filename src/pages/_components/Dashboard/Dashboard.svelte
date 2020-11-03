<script lang="ts">
  import { user } from "../../../store";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  import type { ISurveyList } from "../../../types/ISurvey";
  import { getSurveysByEmail, docListToSurveyList } from "../../../DB/Survey";

  import SurveyList from "../SurveyList.svelte";
  import SurveyCode from "../SurveyCode.svelte";

  let surveysOfCurrentUser: Promise<
    ISurveyList[]
  > = getAllSurveysOfCurrentUser();

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
  button {
    padding: 0.8rem;
    background-color: var(--primary-purple);
    font-size: 1.5rem;
    border-radius: 0.2rem;
    text-align: right;
  }

  p {
    font-size: 1.2rem;
  }
  p {
    font-weight: 500;
  }

  button {
    background: var(--primary-purple);
    padding: 0.8rem;
    margin-top: 1rem;
    font-weight: 600;
    font-style: 1.3rem;
  }
</style>

<template>
  <p>Hi! {userObj.displayName}</p>

  <SurveyCode />

  {#await surveysOfCurrentUser}
    <p>getting ur surveys!!</p>
  {:then surveys}
    <SurveyList {surveys} />
    <button on:click={() => (surveysOfCurrentUser = showAllSurveys())}>Show all
      surveys that you have</button>
  {/await}
</template>
