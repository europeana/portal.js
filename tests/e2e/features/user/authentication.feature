Feature: Authentication
# This file does not contain any tests for actual authentication yet,
# rather it tests scenarios pertaining to the user being unauthenticated.
# TODO: Authentication requires additional mechanisms in place to allow fixture based login.

  Scenario: Not being Authenticated
    When I am on the `home page`
    Then I see the `log in link`

  Scenario: Visiting my account without being authenticated
    When I visit the `account page`
    Then I should not be on the `account page`

  Scenario: Using back button from login page
   Given I am on the `home page`
   When I click the `log in link`
   And I see the Keycloak login form
   And I go back
   Then I should be on the `home page`
