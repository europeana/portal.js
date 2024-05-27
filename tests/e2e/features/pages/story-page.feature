Feature: Story page

  Scenario: Immersive story page
    When I open the `immersive story page`
    Then I see a `story hero` in the `story page`
    When I open the `story page`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Story that is not immersive
    When I open the `story page`
    Then I don't have a `story hero` in the `story page`
    And I see a `authored head` in the `story page`

  Scenario: Story post not found
    When I open `/stories/404-not-found`
    Then I should be on `/en/stories`
