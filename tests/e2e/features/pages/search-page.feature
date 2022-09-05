Feature: Search Page

  Scenario: Seeing a Europeana branded page title

    When I open a `search page`
    Then I should have a Europeana branded page title

  Scenario: Seeing user buttons

    When I open a `search page`
    And I hover over a `item preview`
    Then I see a `add button`
    And I see a `like button`
