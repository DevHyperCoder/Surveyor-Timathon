<script lang="ts">
  import HomePage from "./_components/HomePage/HomePage.svelte";
  import Dashboard from "./_components/Dashboard/Dashboard.svelte";

  import { metatags } from "@sveltech/routify";
  metatags.title = "Surveyor";
  metatags.description = "Quick and easy surveys";

  import { user } from "../store";

  let userObj: firebase.User;
  user.subscribe((u) => (userObj = u));
</script>

{#if userObj}
  <Dashboard />
{:else}
  <HomePage />
{/if}
