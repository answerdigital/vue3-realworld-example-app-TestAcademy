/// <reference types="cypress" />

const dayjs = require("dayjs");

describe("Logged in user should be able to add a comment", () => {
  beforeEach(() => {
    cy.reload();
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
    cy.openFirstArticle();
  });

  it("Comments can be posted", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Act
    cy.getByTestId("write-comment").type("This is a test comment");

    cy.getByTestId("submit-comment").should("not.be.disabled");

    cy.getByTestId("submit-comment").click();

    //Assert
    cy.getByTestId("posted-comment-text").should("be.visible");
  });

  it("Posted comment details are correct", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Act
    cy.addComment("test comment")
      .invoke("text")
      .then(($commentText) => {
        const commentText: string = $commentText;

        //Assert
        cy.getByTestId("posted-comment-text").should("be.visible");

        cy.getByTestId("posted-comment-text")
          .invoke("text")
          .should("equal", commentText);
      });

    cy.getByTestId("author-profile").should("be.visible");

    cy.getByTestId("author-profile")
      .invoke("text")
      .then(($authorName) => {
        const authorName: string = $authorName;

        cy.getByTestId("profile")
          .invoke("text")
          .then((removeSpace) => {
            const start = removeSpace.indexOf(" ");
            return removeSpace.slice(start + 1);
          })
          .should("equal", authorName);
      });

    cy.getByTestId("comment-date-posted").should("be.visible");

    cy.getByTestId("comment-date-posted")
      .invoke("text")
      .should("equal", dayjs().format("M/D/YYYY"));
  });

  it("Comment accepts regular characters", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Act
    cy.addComment(
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-!! !! ?? // ++++++",
    )
      .invoke("text")
      .then(($commentText) => {
        const commentText: string = $commentText;

        //Assert
        cy.getByTestId("posted-comment-text").should("be.visible");

        cy.getByTestId("posted-comment-text")
          .invoke("text")
          .should("equal", commentText);
      });
  });

  it("Post comment button is disabled if text box blank", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Assert
    cy.getByTestId("submit-comment").should("be.disabled");
  });

  it.skip("Post comment button is disabled after posting comment", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Act
    cy.getByTestId("write-comment").type("This is a test comment");

    cy.getByTestId("submit-comment").click();

    //Assert
    cy.get("[data-test=submit-comment]", { timeout: 0 }).should("be.disabled");
  });

  it("HTML tag do not break the comment box", () => {
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Act
    cy.addComment("<strong >My First Heading</strong>");

    cy.addComment('<a href="https://answerdigital.com/">This is a link</a>');

    //Assert
  });
});

describe("Logged in user should be able to delete their comment", () => {
  beforeEach(() => {
    cy.reload();
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });

  it("The delete icon appears and is functional", () => {
    cy.openArticleAndBackendComment("single-comment.json");

    cy.getByTestId("posted-comment-text").should("be.visible");

    cy.getByTestId("articleContent").should("exist");

    //Act
    cy.getByTestId("delete-comment").should("be.visible");

    cy.intercept(
      "DELETE",
      "https://api.realworld.io/api/articles/**/comments/1",
      {
        statusCode: 200,
      },
    ).as("deleteComment");

    cy.getByTestId("delete-comment").click();

    cy.wait("@deleteComment");

    //Assert
    cy.getByTestId("posted-comment-text").should("not.exist");

    cy.getByTestId("comment-date-posted").should("not.exist");

    cy.getByTestId("author-profile").should("not.exist");

    cy.getByTestId("author-profile-picture").should("not.exist");
  });

  it("Other user's comments cannot be deleted", () => {
    //Arrange
    cy.visit("/#/");

    cy.openArticleAndBackendComment("other-user-comment.json");

    cy.getByTestId("articleContent").should("exist");

    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    //Assert
    cy.getByTestId("posted-comment-text").should("be.visible");

    cy.getByTestId("comment-date-posted").should("be.visible");

    cy.getByTestId("author-profile").should("be.visible");

    cy.getByTestId("delete-comment").should("not.exist");
  });
});

describe("Multiple comments", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");

    cy.visit("http://localhost:5173/#/");
  });

  it("The newest comment displays at the top", () => {
    //Act
    cy.openArticleAndBackendComment("three-comments.json");

    cy.getByTestId("articleContent").should("exist");

    cy.addComment("New comment");

    //Assert
    cy.getByTestId("posted-comment-text").eq(3).should("be.visible");

    cy.getByTestId("posted-comment-text")
      .eq(0)
      .invoke("text")
      .should("equal", "New comment");
  });

  it("The correct comment of multiple is deleted", () => {
    cy.openFirstArticle();

    cy.getByTestId("articleContent").should("exist");

    cy.addComment("Comment 1");

    cy.getByTestId("posted-comment-text").eq(0).should("be.visible");

    cy.addComment("Comment 2");

    cy.getByTestId("posted-comment-text").eq(1).should("be.visible");

    cy.addComment("Comment 3");

    cy.getByTestId("posted-comment-text").eq(2).should("be.visible");
    //Act
    cy.getByTestId("delete-comment").eq(1).should("be.visible");

    cy.getByTestId("delete-comment").eq(1).click();

    //Assert
    cy.getByTestId("posted-comment-text").eq(1).should("not.contain", "2");
  });
});

const sizes: Cypress.ViewportPreset[] = [
  "iphone-6",
  "ipad-2",
  "iphone-3",
  "macbook-16",
  "samsung-s10",
];

describe("Resolution testing", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");

    cy.openArticleAndBackendComment("single-comment.json");

    cy.getByTestId("articleContent").should("exist");
  });
  sizes.forEach((size) => {
    it(`On ${size} devices, comments display correctly`, () => {
      cy.viewport(size);

      cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

      cy.getByTestId("posted-comment-text").should("be.visible");

      cy.getByTestId("comment-date-posted").should("be.visible");

      cy.getByTestId("author-profile").should("be.visible");

      cy.getByTestId("delete-comment").should("be.visible");
    });
  });
});
