Feature: Exhibition chapter page

  Scenario: View exhibition chapter

    When I open the `exhibition chapter`
    Then I see an `exhibition chapter`
    And I see a `link list`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: See a credits card

    When I open the `exhibition chapter`
    Then I see a `link list`
    And I see an `link list credits item`
