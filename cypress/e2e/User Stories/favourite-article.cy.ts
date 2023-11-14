/// <reference types="cypress" />

describe("Favouriting article", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });

  it("Colour of main feed unselected like button correct", () => {
    cy.openAndInterceptHomePageArticles("unfavorited-article-home-page.json");

    cy.checkDeselectedColourStyling("home-favorite-button");
  });

  it("Colour of article unselected like button correct", () => {
    cy.openAndInterceptFullArticle("unfavorited-full-article.json");

    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.checkDeselectedColourStyling("article-favorite-button");
  });

  it("Colour of main feed selected like button correct", () => {
    cy.openAndInterceptHomePageArticles("favorited-article-home-page.json");

    cy.checkSelectedColourStyling("home-favorite-button");
  });

  it("Colour of article selected like button correct", () => {
    cy.openAndInterceptFullArticle("favorited-full-article.json");

    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

    cy.checkSelectedColourStyling("article-favorite-button");
  });

  it("Can like & unlike article - home page", () => {
    //Arrange

    //Act
    cy.checkDeselectedColourStyling("home-favorite-button");

    cy.getByTestId("home-favorite-button").eq(0).click();

    //Assert
    cy.checkSelectedColourStyling("home-favorite-button");

    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.checkDeselectedColourStyling("home-favorite-button");
  });

  it("Can like & unlike article - article page", () => {
    //Arrange

    //Act
    cy.getByTestId("open-article").eq(0).click();

    //Assert
    cy.url().should("contain", Cypress.config().baseUrl + "/#/article");

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.getByTestId("article-favorite-button").eq(1); //checks the second copy of the button exists
  });

  it("Like counter increments correctly - home page", () => {
    //Arrange

    //Act
    cy.parseLikeCounterIntegerHome(0).then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.intercept("https://api.realworld.io/api/articles/**/favorite").as(
        "favourites",
      );

      cy.getByTestId("home-favorite-button").eq(0).click();

      cy.wait("@favourites");

      //Assert
      cy.parseLikeCounterIntegerHome(0).should("equal", likeCountFirst + 1);

      cy.getByTestId("home-favorite-button").eq(0).click();

      cy.wait("@favourites");

      cy.parseLikeCounterIntegerHome(0).should("equal", likeCountFirst);
    });
  });

  it("Like counter increments correctly - article page", () => {
    //Arrange
    cy.openFirstArticle();

    cy.resetLikeCounter(); // Like counter is broken, this resets it

    //Act
    cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

    cy.parseLikeCounterIntegerArticle().then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("article-favorite-button").eq(0).click();

      //Assert
      cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

      cy.parseLikeCounterIntegerArticle().should("equal", likeCountFirst + 1);

      cy.getByTestId("article-favorite-button").eq(0).click();

      cy.getByTestId("article-favorite-button").eq(0).contains("Favorite");

      cy.parseLikeCounterIntegerArticle().should("equal", likeCountFirst);
    });
  });
});

describe("Persistence of data", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });
  it("Deselected like counter number persists between home & article page", () => {
    cy.parseLikeCounterIntegerHome(0).then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("open-article").eq(0).click();

      cy.parseLikeCounterIntegerArticle().should("equal", likeCountFirst);
    });
  });

  it("Selected like counter number persists between home & article page", () => {
    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.checkSelectedColourStyling("home-favorite-button");

    cy.parseLikeCounterIntegerHome(0).then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("open-article").eq(0).click();

      cy.parseLikeCounterIntegerArticle().should("equal", likeCountFirst);
    });
  });
  it("Deselected like counter number persists between article & home page", () => {
    cy.openFirstArticle();

    cy.parseLikeCounterIntegerArticle().then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("global-feed").click();

      cy.parseLikeCounterIntegerHome(0).should("equal", likeCountFirst);
    });
  });

  it("Selected like counter number persists between article & home page", () => {
    cy.openFirstArticle();

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

    cy.parseLikeCounterIntegerArticle().then(($likeCountFirst) => {
      const likeCountFirst: number = $likeCountFirst;

      cy.getByTestId("global-feed").click();

      cy.parseLikeCounterIntegerHome(0).should("equal", likeCountFirst);
    });
  });
  it("Deselected favourite button persists between home & article page", () => {
    cy.checkDeselectedColourStyling("home-favorite-button");

    cy.getByTestId("open-article").eq(0).click();

    cy.checkDeselectedColourStyling("article-favorite-button");
  });
  it("Deselected favourite button persists between article & home page", () => {
    cy.openFirstArticle();

    cy.checkDeselectedColourStyling("article-favorite-button");

    cy.getByTestId("global-feed").click();

    cy.checkDeselectedColourStyling("home-favorite-button");
  });
  it("Selected favourite button persists between home & article page", () => {
    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.checkSelectedColourStyling("home-favorite-button");

    cy.getByTestId("open-article").eq(0).click();

    cy.checkSelectedColourStyling("article-favorite-button");
  });
  it("Selected favourite button persists between article & home page", () => {
    cy.openFirstArticle();

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.getByTestId("article-favorite-button").eq(0).contains("Unfavorite");

    cy.checkSelectedColourStyling("article-favorite-button");

    cy.getByTestId("global-feed").click();

    cy.checkSelectedColourStyling("home-favorite-button");
  });
});
describe("Logged out actions", () => {
  it("Can't like article when logged out - home page", () => {
    cy.visit("./#/");

    cy.getByTestId("home-favorite-button").eq(0).click();

    cy.on("uncaught:exception", () => {
      return false;
    });

    cy.url().should("contain", Cypress.config().baseUrl + "/#/login");
  });

  it("Can't like article when logged out - article page", () => {
    cy.openFirstArticle();

    cy.getByTestId("article-favorite-button").eq(0).click();

    cy.on("uncaught:exception", () => {
      return false;
    });

    cy.url().should("contain", Cypress.config().baseUrl + "/#/login");
  });
});

const likesizes: Cypress.ViewportPreset[] = [
  "iphone-6",
  "ipad-2",
  "samsung-note9",
  "macbook-16",
  "samsung-s10",
];
describe("Resolution testing", () => {
  likesizes.forEach((size) => {
    it(`On ${size} devices, comments display correctly`, () => {
      cy.backendLogin("ruaridh@ruaridh.com", "Password");

      cy.viewport(size);

      cy.openAndInterceptFullArticle("unfavorited-full-article.json");

      cy.checkDeselectedColourStyling("article-favorite-button");

      cy.getByTestId("global-feed").click();

      cy.openAndInterceptHomePageArticles("unfavorited-article-home-page.json");

      cy.checkDeselectedColourStyling("home-favorite-button");

      cy.openAndInterceptFullArticle("favorited-full-article.json");

      cy.checkSelectedColourStyling("article-favorite-button");

      cy.getByTestId("global-feed").click();

      cy.openAndInterceptHomePageArticles("favorited-article-home-page.json");

      cy.checkSelectedColourStyling("home-favorite-button");
    });
  });
});
