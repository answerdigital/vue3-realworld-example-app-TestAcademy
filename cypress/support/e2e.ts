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

Cypress.Commands.add("openAndInterceptHomePageArticles", (fixture) => {
  cy.intercept(
    "GET",
    "https://api.realworld.io/api/articles?limit=10&offset=0",
    {
      fixture: fixture,
    },
  ).as("homepage-articles");

  cy.reload();

  cy.visit("http://localhost:5173/#/");

  cy.wait("@homepage-articles");
});

Cypress.Commands.add("openFirstArticle", () => {
  cy.visit("http://localhost:5173/#/");

  cy.getByTestId("open-article").eq(0).click();

  cy.url().should("contain", "/#/article");
});

Cypress.Commands.add("openAndInterceptFullArticle", (fixture) => {
  cy.intercept("GET", "https://api.realworld.io/api/articles/**", {
    fixture: fixture,
  }).as("article-page");

  cy.openFirstArticle();

  cy.wait("@article-page");
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

  cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

  cy.getByTestId("article-favorite-button").eq(0).click();

  cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

  cy.getByTestId("article-favorite-button").eq(0).click();
});

Cypress.Commands.add("parseLikeCounterIntegerArticle", () => {
  cy.getByTestId("like-counter")
    .eq(0)
    .invoke("text")
    .then((removeBrackets) => {
      const start = removeBrackets.indexOf("(");
      const end = removeBrackets.indexOf(")", start);
      return removeBrackets.slice(start + 1, end);
    })
    .then(parseInt);
});

Cypress.Commands.add("parseLikeCounterIntegerHome", (place) => {
  cy.getByTestId("home-favorite-button")
    .eq(place)
    .invoke("text")
    .then(parseInt);
});

Cypress.Commands.add("checkDeselectedColourStyling", (button) => {
  cy.getByTestId(button).eq(0).should("have.css", "color", "rgb(92, 184, 92)"); //green text

  cy.getByTestId(button)
    .eq(0)
    .should("have.css", "border-color", "rgb(92, 184, 92)"); //green border

  cy.getByTestId(button)
    .eq(0)
    .should("have.css", "background-color", "rgba(0, 0, 0, 0)"); //transparent background
});

Cypress.Commands.add("checkSelectedColourStyling", (button) => {
  cy.getByTestId(button)
    .eq(0)
    .should("have.css", "color", "rgb(255, 255, 255)"); //white text

  cy.getByTestId(button)
    .eq(0)
    .should("have.css", "border-color", "rgb(92, 184, 92)"); //green border

  cy.getByTestId(button)
    .eq(0)
    .should("have.css", "background-color", "rgb(92, 184, 92)"); //green fill
});
