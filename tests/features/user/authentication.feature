Feature: Logging in

  Scenario: Logging in
    Given I am on the `home page`
    When I click the `log in button`
    And I submit my europeana auth credentials
    Then I am on the `account page`
    And I see the `account button`

  @logged-in
  Scenario: Visiting my account
    Given I am on the `home page`
    When I click the `account button`
    And I click the `likes and galleries button`
    Then I am on the `account page`
    And I see the 'account button`

  @logged-in
  Scenario: logging out
    Given I am on the `home page`
    When I click the `account button`
    And I click the `log out button`
    Then I am on the `home page`
    And I see the 'log in button`
