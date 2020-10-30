<style>
section {
    width: 75%;
    margin: auto;
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
