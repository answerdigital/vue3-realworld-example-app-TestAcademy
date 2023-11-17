<template>
  <footer
  data-test="footer">
    <div class="container">
      <AppLink
        name="global-feed"
        class="logo-font"
        data-test="conduit-logo"
      >
        conduit
      </AppLink>
      <span class="attribution"
      data-test="first-footer-text">
        An interactive learning project from <a href="https://thinkster.io" data-test="thinkster-link">Thinkster</a>. Code &amp; design licensed under MIT.
      </span>
    </div>
    <div class="container">
      <span
        class="attribution"
        data-test="second-footer-text"
        style="margin: 0"
      >
        <a href="https://github.com/mutoe/vue3-realworld-example-app" data-test="github-link">Real world app</a> implementation using Vue v3 with Typescript and Composition Api
      </span>
    </div>
  </footer>
</template>
