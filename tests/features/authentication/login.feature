Feature: Authentication

  Scenario: Using back button from login page
   Given I am on the `home page`
   When I click the `log in button`
   And I see the Keycloak login form
   And I go back
   Then I should be on the `home page`
