/// <reference types="cypress" />

describe("Commenting actions", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
    cy.openFirstArticle();
  });
  it("Logged in comment", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("write-comment").type("This is a test comment");

    cy.getByTestId("submit-comment").click();

    cy.getByTestId("posted-comment-text").should("be.visible");

    cy.addComment("testing a second comment")

    cy.getByTestId("posted-comment-text").eq(1).should("be.visible");

    cy.getByTestId("delete-comment").eq(1).click();

    cy.getByTestId("posted-comment-text").eq(1).should("not.exist");

    cy.getByTestId("delete-comment").eq(0).click();

    cy.getByTestId("posted-comment-text").should("not.exist");
  });
});