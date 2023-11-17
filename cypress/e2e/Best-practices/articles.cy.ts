/// <reference types="cypress" />

const tags = [
  "#/tag/welcome",
  "#/tag/implementations",
  "#/tag/introduction",
  "#/tag/codebaseShow",
  "#/tag/ipsum",
  "#/tag/qui",
  "#/tag/cupiditate",
  "#/tag/et",
  "#/tag/quia",
  "#/tag/deserunt",
];

describe("article feed", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });

  tags.forEach((tag) => {
    it("Allows the user to filter by tag", () => {
      //Arrange
      const tagString = `[href="${tag}"]`;

      //Act
      cy.get(tagString).click();

      //Assert
      cy.url().should("contain", tag);
    });
  });

  it("Allows the user to view their own article feed", () => {
    //Arrange

    //Act
    cy.getByTestId("my-feed").click();

    //Assert
    cy.url().should("equal", Cypress.config().baseUrl + "/#/my-feeds");

    cy.getByTestId("my-feed").contains("Your Feed");

    //Act - Return home
    cy.get(".nav").contains("Global Feed").click();

    //Assert
    cy.url().should("equal", Cypress.config().baseUrl + "/#/");

    cy.get(".nav").contains("Global Feed");
  });
});

describe("article actions", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });
  it("Allows the user to like & unlike article", () => {
    //Arrange

    //Act
    cy.getByTestId("home-favorite-button").eq(0).click();
    
    cy.getByTestId("home-favorite-button").eq(0).click() //like/unlike

    cy.getByTestId("open-article").eq(0).click();

    //Assert
    cy.url().should(
      "equal",
      Cypress.config().baseUrl +
        "/#/article/If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863",
    ); //would be different if the article at the top of the list changes

    //Act
    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");
    
    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(1);

  });

  it("Allows the user to follow & unfollow author", () => {
    //Arrange
    cy.openFirstArticle();

    //Act
    cy.get(".container").contains("Follow").click(); //Top follow button

    cy.get(".container").contains("Unfollow").click();

    cy.get(".article-actions").contains("Follow").click(); //Bottom follow button

    cy.get(".article-actions").contains("Unfollow").click();

    cy.get(".container >>> .author").click()

    cy.get(".user-info").contains('Follow').click()

    cy.get(".user-info").contains('Unfollow').click()

    //Assert
    cy.get(".user-info").contains('Follow')
  });
});

