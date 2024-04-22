Feature: Exhibitions page

  Scenario: Viewing an index of exhibitions

    When I open the `exhibitions page`
    Then I see a `content card` in the `hub page card group`
    And I am on an accessible page
    And I should have a Europeana branded page title
