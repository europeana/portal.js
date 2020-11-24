Feature: Exhibition page

  Scenario: View exhibition page

    When I open the `exhibition page`
    Then I see `exhibition text`
    And I see `exhibition chapters`
    And I am on an accessible page
    And I should have a Europeana branded page title
