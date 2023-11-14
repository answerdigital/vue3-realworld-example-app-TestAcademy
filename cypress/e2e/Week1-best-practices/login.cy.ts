/// <reference types="cypress" />

describe("login", () => {
  it("Allows user to log in with valid credentials", () => {
    //Arrange
    cy.visit("/#/login");

    //Act
    cy.getByTestId("email-input").type("ruaridh@ruaridh.com");

    cy.getByTestId("password-input").type("Password");

    cy.getByTestId("signin-button").click();

    //Assert
    cy.url().should("equal", Cypress.config().baseUrl + "/#/");
  });

  it("Prevents user from logging in with invalid credentials - email", () => {
    //Arrange

    //Act
    cy.login("ruaridh@ruaridh.co.uk", "Password");

    //Assert
    cy.url().should("include", "/#/login");

    cy.getByTestId("error-message").contains("email or password is invalid");
  });

  it("Prevents user from logging in with invalid credentials - password", () => {
    //Arrange

    //Act
    cy.login("ruaridh@ruaridh.com", "Passwordzz");

    //Assert
    cy.url().should("include", "/#/login");

    cy.getByTestId("error-message").contains("email or password is invalid");

    // cy.contains('email must contain @ sign').should('be.visible');
  });

  it("Prevents user from logging in with no credentials", () => {
    //Arrange
    cy.visit("/#/login");

    //Act

    //Assert
    cy.getByTestId("signin-button").should("be.disabled");

    cy.url().should("include", "/#/login");
  });
});

describe("logout", () => {
  beforeEach(() => {
    cy.backendLogin("ruaridh@ruaridh.com", "Password");
  });

  it("Allows user to log out from Home Page", () => {
    //Arrange
    cy.getByTestId("settings").click();

    //Act
    cy.getByTestId("logout-button").click();

    //Assert
    cy.url().should("include", "/#/");
  });

  it("Allows user to log out from profile Page", () => {
    //Arrange
    cy.getByTestId("profile").click(); //profile name button from Navbar

    //Act
    //cy.url().should('equal', 'http://localhost:5173/#/profile/Ruaridh'); //is this valuable?

    cy.getByTestId("Profile-button").click();

    //cy.url().should('equal', 'http://localhost:5173/#/settings');

    cy.getByTestId("logout-button").click();

    //Assert
    cy.url().should("include", "/#/");
  });


});
