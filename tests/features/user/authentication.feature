Feature: Logging in

  Scenario: Logging in
    Given I am on the `home page`
    When I click the `log in button`
    And I submit my europeana auth credentials
    Then I should be on the `account page`
    And I don't have a `hamburger button` in the `header`
    And I see the `account button`

  @logged-in
  Scenario: Visiting my account
    Given I am on the `home page`
    When I click the `account button`
    And I click the `likes and galleries button`
    Then I should be on the `account page`
    And I see the 'account button`

  @logged-in
  Scenario: logging out
    Given I am on the `home page`
    When I click the `account button`
    And I click the `log out button`
    Then I should be on the `home page`
    And I see the 'log in button`
