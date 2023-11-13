/// <reference types="cypress" />
// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add("getByTestId", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("backendLogin", (email, password) => {
  cy.request("POST", "https://api.realworld.io/api/users/login", {
    user: { email: email, password: password },
  }).then((response) => {
    const user = JSON.stringify({
      email: response.body.user.email,
      username: response.body.user.username,
      bio: response.body.user.bio,
      image: response.body.user.image,
      token: response.body.user.token,
    });

    window.localStorage.setItem("user", user);

    cy.visit("http://localhost:5173/#/");
  });
});

Cypress.Commands.add("backendLogout", () => {
  cy.clearAllLocalStorage();

  cy.clearAllCookies();

  cy.visit("http://localhost:5173/#/");

  cy.getByTestId("profile").should("not.exist");
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:5173/#/login");

  cy.getByTestId("email-input").type(email);

  cy.getByTestId("password-input").type(password);

  cy.getByTestId("signin-button").click();
});

Cypress.Commands.add("logout", () => {
  cy.getByTestId("settings").click();

  cy.getByTestId("logout-button").click();

  cy.url().should("include", "/#/");
});

Cypress.Commands.add("openFirstArticle", () => {
  cy.visit("http://localhost:5173/#/");

  cy.getByTestId("open-article").eq(0).click();

  cy.url().should("contain", "/#/article");
});

Cypress.Commands.add("addComment", (text) => {
  cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

  cy.getByTestId("write-comment").type(text);

  cy.getByTestId("submit-comment").click();

  cy.getByTestId("posted-comment-text").should("be.visible");
});

Cypress.Commands.add("backendComment", (fixture) => {
  cy.intercept("GET", "https://api.realworld.io/api/articles/**/comments", {
    // * is a wildcard here
    fixture: fixture,
    times: 2,
  }).as("comments");
  cy.getByTestId("posted-comment-text").should("be.visible");
});

Cypress.Commands.add("openArticleAndBackendComment", (fixture) => {
  cy.intercept("GET", "https://api.realworld.io/api/articles/**/comments", {
    // * is a wildcard here
    fixture: fixture,
  }).as("comments");
  cy.visit("http://localhost:5173/#/");

  cy.getByTestId("open-article").eq(0).click();

  cy.wait("@comments");
  
  cy.getByTestId("posted-comment-text").should("be.visible");
});

Cypress.Commands.add("resetLikeCounter", () => {
  cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

  cy.getByTestId("favorite-button").eq(0).contains("Favorite");

  cy.getByTestId("favorite-button").eq(0).click();

  cy.getByTestId("favorite-button").eq(0).contains("Unfavorite");

  cy.getByTestId("favorite-button").eq(0).click();
});

Cypress.Commands.add("parseLikeCounterInteger", () => {
  cy.getByTestId("like-counter")
    .eq(0)
    .invoke("text")
    .then((removeBrackets) => {
      const start = removeBrackets.indexOf("(");
      const end = removeBrackets.indexOf(")", start);
      return removeBrackets.slice(start + 1, end);
    })
    .should("be.a", "string")
    .then(parseInt)
    .should("be.a", "number");
});
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Get DOM element by data-testid attribute.
       *
       * @param {string} value - The value of the data-testid attribute of the target DOM element.
       * @return {HTMLElement} - Target DOM element.
       */

      getByTestId(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to bypass manual login and enter user details directly to local storage.
       *
       * @param {string} email - the email address of the user account.
       * @param {string} password - the password of the user account, matching the email.
       * @return - a string to insert into local storage.
       */

      backendLogin(email: string, password: string): Chainable<Subject>;

      /**
       * Does not yet work :(
       */

      backendLogout(): Chainable<Subject>;

      /**
       * Custom command to manually login through the UI.
       *
       * @param {string} email - the email address of the user account.
       * @param {string} password - the password of the user account, matching the email.
       * @return - user is logged in.
       */

      login(email: string, password: string): Chainable<Subject>;

      /**
       * Custom command to manually logout through the UI. Will navigate to settings page and click the logout button.
       * You must be logged in to run this.
       *
       * @return - returns to home page, logged out.
       */

      logout(): Chainable<Subject>;

      /**
       * Custom command to open the first article on the site.
       * Will navigate to global feed and select the top (most recent) article and ensure it has opened.
       *
       * @return - latest article page
       */

      openFirstArticle(): Chainable<Subject>;

      /**
       * Custom command to write a comment and submit it.
       * You must be on an article page to run this.
       *
       * @param {string} text - the comment you want to enter
       * @return The comment is posted to the article
       */

      addComment(text: string): Chainable<Subject>;

      /**
       * Custom command to intercept article comments in the API.
       *
       * @param {string} fixture - the json file (include .json ending) with the comments you wish to enter in
       * @return The comments are in the article when the page loads
       */
      backendComment(fixture: string): Chainable<Subject>;

      openArticleAndBackendComment(fixture: string): Chainable<Subject>;

      /**
       * Custom command to reset the like counter as it does not work as it should and can get stuck.
       * You must be on an article page to run this.
       * Clicks the like button twice and ensures it says 'favourite' again.
       */

      resetLikeCounter(): Chainable<Subject>;

      /**
       * Custom command to parse an integer from the like counter.
       * Removes brackets from element and parses to an integer.
       * You must be on an article page to run this.
       *
       * @return An integer parsed from the like counter
       */

      parseLikeCounterInteger(): Chainable<Subject>;
    }
  }
}
