Feature: Authentication
# This file does not contain any tests for actual authentication yet,
# rather it tests scenarios pertaining to the user being unauthenticated.
# TODO: Authentication requires additional mechanisms in place to allow fixture based login.

  Scenario: Not being Authenticated
    When I am on the `home page`
    Then I see the `log in button`

  Scenario: Visiting my account without being authenticated
    When I visit the `account page`
    Then I should not be on the `account page`
