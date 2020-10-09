<script lang="ts">
  import { user } from "../../../store";
import { redirect } from "@sveltech/routify";
  let userObj: firebase.User;

  user.subscribe((u) => (userObj = u));

</script>

<style>
</style>

<template>
  <p>Hi! {userObj.displayName}</p>
</template>
