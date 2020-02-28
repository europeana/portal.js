Feature: Exhibition chapter page

  Scenario: View exhibition chapter

    When I open the `exhibition chapter`
    Then I see an `exhibition chapter`
    And I see `exhibition chapters`
    And I am on an accessible page

  Scenario: See only a next chapter button

    When I open the `exhibition chapter`
    Then I see a `next chapter button`
    And I don't have a `previous chapter button`

  Scenario: See a previous and next navigation

    When I open the `exhibition chapter`
    And I see a `next chapter button`
    And I click the `next chapter button`
    And I wait for the page to load
    Then I see a `previous chapter button`

  Scenario: See a credits card

    When I open the `exhibition chapter`
    Then I see `exhibition chapters`
    And I see an `exhibitions credits card`
