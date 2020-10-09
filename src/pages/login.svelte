<script lang="ts">
  // CTA Button
  import CTAButton from "./_components/CTAButton/index.svelte";
  
  import { redirect } from "@sveltech/routify";

  function redirectToHomePage(){
    $redirect('/');
  }

  // Svelte Store => User import
  import { user } from "../store";

  // User Object
  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  import { auth, googleProvider } from "../firebase";

  // Login function
  function login() {
    auth.signInWithPopup(googleProvider);
  }
</script>

<style>
  .bg {
    width: 100vw;
    background-image: url("/images/login-bg.png");
  }
  section {
    width: 1400px;
    margin: auto;
    color: black;
    display: flex;
    align-items: center;
flex-wrap: wrap;
    padding: 4rem 2rem;
    text-align: center;
  }
  article {
    margin-top: 2rem;
    padding-top: 1.5rem;
    flex: 50%;
  }
  .img-container h1 {
    padding-top: 1.5rem;
    font-size: 2.2rem;
    text-align: left;
  }
  .img-container h1::first-letter {
    color: aliceblue;
  }
  .img-container img{
    margin-top: 1.5rem;}


  .img-container {
    background-color: var(--primary-purple);
  }

  @media screen and (max-width: 600px) {
    article {
      width: 100%;
    }
    section{width:100%;}
  }
</style>

<template>
  <div class="bg parent-height-100">
    <section>
      <article class="img-container">
        <h1>Surveyor</h1>
        <img src="/images/login-img.png" alt="klkjj" />
      </article>
      <article>
        {#if userObj}
          <h2>Welcome {userObj.displayName}!</h2>
          <CTAButton onClick={redirectToHomePage} Class="cta" value="See your surveys ->"/>
        {:else}
          <h1>Login</h1>
          <CTAButton Class="google cta" onClick={login} value="Sign in with Google"/>
          {/if}
      </article>
    </section>
  </div>
</template>
