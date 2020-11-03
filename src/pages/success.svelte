<script lang="ts">
  import { redirect } from "@sveltech/routify";

  import { db } from "../firebase";

  import { user } from "../store";

  import type { IFeedback } from "../types/IFeedback";

  let userObj: firebase.User;

  user.subscribe((u) => (userObj = u));

  let feedBackText: string;
  let ratingNum: string;

  async function submitFeedback() {
    const feedBack: IFeedback = {
      text: feedBackText,
      ratingNum: +ratingNum,
      userName: getUserName(),
    };
    db.collection("feedback").add(feedBack);
    $redirect("/");
  }

  function getUserName() {
    if (userObj) {
      return userObj.displayName;
    }
    return undefined;
  }
</script>

<style>
  div {
    width: 75%;
    margin: auto;
  }

  @media screen and (max-width: 1200px) {
    div {
      width: 85%;
    }
  }

  @media screen and (max-width: 750px) {
    div {
      width: 95%;
    }
  }

  textarea {
    resize: none;
    width: 100%;
    height: 10ch;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  button {
    background-color: var(--primary-purple);
    border-radius: 5px;
    padding: 0.8rem;
    margin-top: 2rem;
  }
</style>

<template>
  <div>
    {#if userObj}
      <p>Thanks {userObj.displayName} for attempting the survey!!</p>

      <h1>Feedback</h1>

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
  </div>
</template>
