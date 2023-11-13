/// <reference types="cypress" />

describe("article actions", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });
  it("Allows the user to like & unlike article", () => {
    //Arrange

    //Act
    cy.getByTestId("fav-btn-1").eq(0).click();

    cy.getByTestId("fav-btn-1").eq(0).click();

    cy.getByTestId("open-article").eq(0).click();

    //Assert
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("favorite-button").eq(0).click();

    cy.getByTestId("favorite-button").eq(0).contains("Unfavorite");

    cy.getByTestId("favorite-button").eq(0).click();

    cy.getByTestId("favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("favorite-button").eq(1);
  });

  // it("Allows the user to check like counter", () => {
  //   cy.openFirstArticle();

  //   cy.resetLikeCounter();

  //   cy.getByTestId("favorite-button").eq(0).contains("Favorite");

  //   cy.getByTestId("like-counter")
  //     .eq(0)
  //     .invoke("text")
  //     .then((removeBrackets) => {
  //       const start = removeBrackets.indexOf("(");
  //       const end = removeBrackets.indexOf(")", start);
  //       return removeBrackets.slice(start + 1, end);
  //     })
  //     .should("be.a", "string")
  //     .then(parseInt)
  //     .should("be.a", "number")
  //     .then(($likeCountFirst) => {
  //       const likeCountFirst: number = $likeCountFirst;

  //       cy.getByTestId("favorite-button").eq(0).click();

  //       cy.getByTestId("favorite-button").eq(0).contains("Unfavorite");

  //       cy.getByTestId("like-counter")
  //         .eq(0)
  //         .invoke("text")
  //         .then((removeBrackets2) => {
  //           const start = removeBrackets2.indexOf("(");
  //           const end = removeBrackets2.indexOf(")", start);
  //           return removeBrackets2.slice(start + 1, end);
  //         })
  //         .should("be.a", "string")
  //         .then(parseInt)
  //         .should("be.a", "number")
  //         .should("equal", likeCountFirst + 1);
  //     });
  // });

  it("Allows the user to check like counter", () => {
    cy.openFirstArticle();

    cy.resetLikeCounter();

    cy.getByTestId("favorite-button").eq(0).contains("Favorite");

    cy.parseLikeCounterInteger().then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("favorite-button").eq(0).click();

      cy.getByTestId("favorite-button").eq(0).contains("Unfavorite");

      cy.parseLikeCounterInteger().should("equal", likeCountFirst + 1);
    });
  });
});