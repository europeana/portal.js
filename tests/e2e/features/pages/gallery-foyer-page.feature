Feature: Gallery foyer page

  Scenario: View an index of galleries

    When I open the `gallery foyer page`
    Then I see a `content card` in the `hub page card group`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Open a gallery
    When I open the `gallery foyer page`
    Then I see a `content card` in the `hub page card group`
    And I click a `content card`
    Then I should not be on the `gallery foyer page`
