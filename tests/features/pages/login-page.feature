Feature: Login page

  Scenario: Navigate to login page

    Given I am on the `English home page`
    Then I see a link to "/en/account/login" in the `header`
    When I open the `login page`
    Then I see the `login page`
    And I am on an accessible page
   

