<script lang="ts">
  // Svelte Store => User import
  import { user } from "../../../store";

  // User Object
  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));

  import { auth, googleProvider } from "../../../firebase";

  // Login function
  function login() {
    auth.signInWithPopup(googleProvider);
  }
</script>

<style>
  nav {
    background-color: var(--primary-red);
    overflow: hidden;
    margin: 0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  nav li {
    text-align: left;
  }
  nav a {
    float: left;
    display: block;
    margin-left: 20px;
    color: var(--primary-font-color);
    font-size: 1.5rem;
    text-decoration: none;
  }
  button {
    background-color: aquamarine;
    color: black;
  }
</style>

<template>
  <nav>
    <ul>
      <li><a href="/"> Surveyor </a></li>
      {#if userObj}
        <li>{userObj.displayName}</li>
        <li><button on:click={()=>{auth.signOut(); console.log("LOGPOUT")}}>Sign Out</button></li>
        <li><a href="/new">New</a></li>
      {:else}<button on:click={login}>Sign in with google</button>{/if}
    </ul>
  </nav>
</template>
