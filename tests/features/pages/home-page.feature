Feature: Home page
  As a user I want to be presented with an entry point to
  the rest of the portal when I visit the base URL. This means
  a curated page is available at the "http(s)://[domain]/" URL.
  This page should allow preview functionality.

  Scenario: Viewing the homepage
    The homepage is a browse page from Contentful

    When I open `/en`
    Then I see a `browse page`
    And I am on an accessible page

  Scenario: Seeing a notification banner

    When I open `/en`
    Then I see a `notification banner`

  @cookie-notice-not-dismissed
  Scenario: Seeing the cookie disclaimer on first visit

    When I open `/en`
    And I see a `cookie disclaimer`
    And I accept cookies
    And I don't see the `cookie disclaimer`
    And I open `/en`
    Then I don't see the `cookie disclaimer`

  Scenario: Logging in a user

    Given I am on the `home page`
    Then I see a link to "/account/login" in the `header`
    And I click the `login button`
    Then I see the element `#username`
    And I enter "dev.test@aqumail.com" into element `#username`
    And I enter "pass1234" into element `#password`
    And I press the ENTER key
    Then I see the `account page`
    And I click the `account page`
    Then I see the `likes collection`
    And I press the TAB key
    And I press the ARROW_RIGHT key
    And I see the `public collections`
    And I press the ARROW_RIGHT key
    And I see the `private collections`
