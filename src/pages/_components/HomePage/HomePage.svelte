<script>
  import CTAButton from "../CTAButton/index.svelte";

  import {redirect} from '@sveltech/routify';

  import { metatags } from "@sveltech/routify";
  metatags.title = "Surveyor";
  metatags.description = "Quick and easy surveys";

  function redirectToLogin(){
    $redirect('/login')
  }
</script>

<style>
  h1 {
    color: var(--primary-dark);
    font-size: 10rem;
    margin: 0;
  }
  h2 {
    color: var(--primary-dark);
    font-size: 2.4rem;
    margin-left: 8rem;
    width: 100%;
  }
  .container {
    max-width: 1200px;
    margin: auto !important;
  }
  @media only screen and (max-width: 1240px) {
    .container {
      max-width: 1200px;
    }
  }
  @media only screen and (max-width: 960px) {
    .container {
      max-width: 900px;
    }
    h2 {
      margin-left: 2rem;
    }
  }
  @media only screen and (max-width: 640px) {
    .container {
      max-width: 400px;
    }

    h2 {
      margin: 0;
    }
    h1 {
      font-size: 5rem;
    }
  }
</style>

<template>
  <div class="container">
    <h1>Surveyor</h1>
    <h2>Online platform to take surveys easily and effciently</h2>
    <CTAButton onClick={redirectToLogin} Class="cta" value="Get Started" />
  </div>
</template>
