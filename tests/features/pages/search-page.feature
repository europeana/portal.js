Feature: Search Page

  Scenario: Seeing a notification banner

    When I open a `search page`
    Then I see a `notification banner`

  Scenario: Seeing user buttons

    When I open a `search page`
    And I hover over a `item preview`
    Then I see a `add button`
    And I see a `like button`
