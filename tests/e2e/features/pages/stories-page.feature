Feature: Stories page

  Scenario: Stories Sections & Cards
    When I open the `stories page`
    Then I see a `content card` in the `stories interface`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Story not found
    When I open `/stories/404-not-found`
    Then I should be on `/en/stories/404-not-found`
    And I see an `error notice`