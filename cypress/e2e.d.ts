declare namespace Cypress {
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
     * Custom command to intercept the homepage on the site.
     * Will navigate to global feed and return articles from the JSON
     * @param {string} fixture - the json file (include .json ending) with the articles you wish to enter in
     *
     * @return - latest article page with fixture details
     */

    openAndInterceptHomePageArticles(fixture: string): Chainable<Subject>;

    /**
     * Custom command to open the first article on the site.
     * Will navigate to global feed and select the top (most recent) article and ensure it has opened.
     *
     * @return - latest article page
     */

    openFirstArticle(): Chainable<Subject>;

    /**
     * Custom command to intercept an article on the site.
     * Will navigate to global feed and return articles from the JSON
     * @param {string} fixture - the json file (include .json ending) with the article data you wish to enter in
     *
     * @return - full article page with fixture details
     */

    openAndInterceptFullArticle(fixture: string): Chainable<Subject>;

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
     * Clicks the like button twice and ensures it says 'favorite' again.
     */

    resetLikeCounter(): Chainable<Subject>;

    /**
     * Custom command to parse an integer from the article page like counter.
     * Removes brackets from element and parses to an integer.
     * You must be on an article page to run this.
     *
     * @return An integer parsed from the like counter
     */

    parseLikeCounterIntegerArticle(): Chainable<Subject>;

    /**
     * Custom command to parse an integer from the home page like counter.
     * Parses to an integer.
     * You must be on an home page to run this.
     *
     * @param place position on the home feed, with 0 being the top article
     * @return An integer parsed from the like counter
     */

    parseLikeCounterIntegerHome(place: number): Chainable<Subject>;

    /**
     * Custom commands to check the border(green), background(transparent) and text colours(green) of the like button when deselected
     *
     * @param button either the article or home page like button - must already be deselected
     */

    checkDeselectedColourStyling(button: string): Chainable<Subject>;
    
    /**
     * Custom commands to check the border (green), background(green) and text colours(white) of the like button when selected
     *
     * @param button either the article or home page like button - must already be selected
     */

    checkSelectedColourStyling(button: string): Chainable<Subject>;
  }
}
