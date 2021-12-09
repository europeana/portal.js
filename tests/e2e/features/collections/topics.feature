Feature: Topics listing page

  Scenario: View an index of topics

    When I visit the `topics listing page`
    Then I see a `collections table`
    And I am on an accessible page
    And I should have a Europeana branded page title
