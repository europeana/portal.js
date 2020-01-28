Feature: Gallery foyer page

  Scenario: View an index of galleries

    When I open the `gallery foyer page`
    Then I see a `content card` in the `gallery foyer`
    And I am on an accessible page
