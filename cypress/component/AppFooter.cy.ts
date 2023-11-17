/// <reference types="cypress" />
import AppFooter from "../../src/components/AppFooter.vue";

describe("Verifying AppFooter component", () => {
  beforeEach(() => {
    cy.mount(AppFooter);
  });
  it("Verify first footer text", () => {
    cy.getByTestId("first-footer-text")
      .invoke("text")
      .should(
        "equal",
        " An interactive learning project from Thinkster. Code & design licensed under MIT. ",
      );
  });

  it("Verify second footer text", () => {
    cy.getByTestId("second-footer-text")
      .invoke("text")
      .should(
        "equal",
        "Real world app implementation using Vue v3 with Typescript and Composition Api ",
      );
  });

  it("Verify logo", () => {
    cy.getByTestId("conduit-logo")
      .invoke("text")
      .should("equal", " conduit ");
  });

  it("Verify thinkster link", () => {
    cy.getByTestId("thinkster-link")
      .should("have.attr", "href")
      .and("include", "https://thinkster.io");
  });

  it("Verify github link", () => {
    cy.getByTestId("github-link")
      .should("have.attr", "href")
      .and("include", "https://github.com/mutoe/vue3-realworld-example-app");
  });
});
