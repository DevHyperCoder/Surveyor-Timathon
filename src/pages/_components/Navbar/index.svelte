<script lang="ts">
  // Svelte Store => User import
  import { user } from "../../../store";

  // User Object
  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  import { auth, googleProvider } from "../../../firebase";
  import { onDestroy } from "svelte";

  let isResponsive = false;

  // Login function
  function login() {
    auth.signInWithPopup(googleProvider);
  }

  onDestroy(() => {
    isResponsive = false;
  });
</script>

<style>
  nav {
    overflow: hidden;
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: row;
  }
  nav li {
    text-align: left;
  }
  nav a,
  nav button {
    margin-left: 20px;
  }
  nav a {
    color: var(--primary-font-color);
    font-size: 1.2rem;
    text-decoration: none;
  }
  button {
    padding: 0.3rem;
    border-radius: 0.2rem;
    background-color: var(--primary-purple);
    color: black;
  }
  svg {
    display: none;
  }
  @media screen and (max-width: 600px) {
    nav ul li:not(:first-child) {
      display: none;
    }
    svg {
      display: block;
    }
    .responsive {
      position: relative;
      flex-direction: column;
      flex-wrap: wrap;
      height: max-content;
    }
    .responsive ul {
      flex-direction: column;
    }
    .responsive svg {
      position: absolute;
      top: 0;
      right: 0;
    }
    nav.responsive ul li {
      display: block;
      text-align: left;
      min-width: 100%;
    }
    .responsive ul {
      flex-direction: column;
    }
  }
  #hero {
    font-weight: 500;
    font-size: 2.2rem;
  }
</style>

<template>
  <nav class:responsive={isResponsive}>
    <ul>
      <li><a id="hero" href="/"> Surveyor </a></li>
      {#if userObj}
        <li><a href="/new">New</a></li>
        <li><a href="/templates">Your Templates</a></li>
        <li><a href="/features">Features</a></li>
        <li>
          <button
            on:click={() => {
              auth.signOut();
            }}>Sign Out</button>
        </li>
      {:else}
        <li><a href="/features">Features</a></li>
      
      
      
      <button on:click={login}>Sign in with google</button>{/if}


      <svg
        width="2rem"
        height="2rem"
        on:click={() => (isResponsive = !isResponsive)}
        viewBox="0 0 16 16"
        class="bi bi-list"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
      </svg>
    </ul>
  </nav>
</template>
