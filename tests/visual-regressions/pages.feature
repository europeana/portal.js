Feature: pages

  Scenario: Take a snapshot of an item page

    When I open a `item page`
    Then I see the `item page`
    And I make a snapshot of the `item page`

  Scenario: Take a snapshot of a search results page

    When I open a `search page`
    Then I see the `notification banner`
    And I make a snapshot of the `search page`


  Scenario: Take a snapshot of a gallery page

    When I open a `gallery page`
    Then I see a `gallery title`
    And I make a snapshot of the `gallery page`

