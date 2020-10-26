<script lang="ts">
  import { redirect } from "@sveltech/routify";

  import { db } from "../firebase";

  import { user } from "../store";

  let userObj: firebase.User;

  user.subscribe((u) => (userObj = u));

  let feedBackText: string;
  let ratingNum: string;

  type IFeedback = {
    text: string;
    ratingNum: number;
    userName?: string;
  };

  async function submitFeedback() {
    const feedBack: IFeedback = {
      text: feedBackText,
      ratingNum: +ratingNum,
      userName: getUName(),
    };
    db.collection("feedback").add(feedBack);
    $redirect("/");
  }

  function getUName() {
    if (userObj) {
      return userObj.displayName;
    }
    return undefined;
  }
</script>

<style>
</style>

<template>
  {#if userObj}
    <p>Thanks {userObj.displayName} for attempting the survey!!</p>

    <h3>Feedback</h3>

    <textarea contenteditable="true" bind:value={feedBackText} />

    <form>
      <label for="1">1</label>
      <input type="radio" value="1" id="1" bind:group={ratingNum} />
      <label for="2">2</label>
      <input type="radio" value="2" id="2" bind:group={ratingNum} />
      <label for="3">3</label>
      <input type="radio" value="3" id="3" bind:group={ratingNum} />
      <label for="4">4</label>
      <input type="radio" value="4" id="4" bind:group={ratingNum} />
      <label for="5">5</label>
      <input type="radio" value="5" id="5" bind:group={ratingNum} />
    </form>
    <button on:click={submitFeedback}>Submit your feedback</button>
  {:else}
    <p>Thanks for attepting the survey</p>
  {/if}
</template>
