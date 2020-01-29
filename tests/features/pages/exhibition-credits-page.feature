Feature: Exhibition credits page

  Scenario: View credits

    When I open the `exhibition credits`
    Then I see a `credits text`
    And I see `exhibition chapters`
    And I am on an accessible page
