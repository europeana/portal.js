Feature: Search Page

  Scenario: Seeing a notification banner

    When I open a `search page`
    Then I see a `notification banner`
    And I should have a Europeana branded page title
