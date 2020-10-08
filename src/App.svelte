<script lang="ts">
  import Router from "@sveltech/routify/runtime/Router.svelte";
  import { routes } from "../.routify/routes";
  import Navbar from "./pages/_components/Navbar/index.svelte";
  import { user } from "./store";
  import { auth } from "./firebase";
  import { authState } from "rxfire/auth";

  const unsubscribe = authState(auth).subscribe((u:firebase.User) => {
    user.set(u);
  });
</script>

<style global>
  @import "../static/global.css";
</style>

<Navbar />
<Router {routes} />
