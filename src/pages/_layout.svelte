<style>
  section {
    width: 75%;
    margin: auto;
    margin-bottom: 5rem;
  }
  @media screen and (max-width: 1200px) {
    section {
      width: 85%;
    }
  }

  @media screen and (max-width: 750px) {
    section {
      width: 95%;
    }
  }
</style>

<section>
  <slot />
</section>
