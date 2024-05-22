Feature: Story pages

  Scenario: Story listing page
    When I open the `stories page`
    Then I see the `stories interface`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Story not found
    When I open `/en/stories/404-not-found`
    Then I should be on `/en/stories`
