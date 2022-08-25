Feature: Exhibition credits page

  Scenario: View credits

    When I open the `exhibition credits`
    Then I see a `credits text`
    And I see `link list`
    And I am on an accessible page
    And I should have a Europeana branded page title
