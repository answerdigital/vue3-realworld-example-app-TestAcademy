/// <reference types="cypress" />

describe("article actions", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });
  it("Allows the user to like & unlike article", () => {
    //Arrange

    //Act
    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.getByTestId("open-article").eq(0).click();

    //Assert
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(1);
  });

  it("Allows the user to check like counter", () => {
    cy.openFirstArticle();

    cy.resetLikeCounter();

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.parseLikeCounterIntegerArticle().then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("article-favorite-button").eq(0).click();

      cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

      cy.parseLikeCounterIntegerArticle().should("equal", likeCountFirst + 1);
    });
  });
});