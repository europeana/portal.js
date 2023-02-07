Feature: Gallery page

  Scenario: View a gallery
    When I open the `gallery page`
    And I see an `item preview` in the `item previews grid`
    And I see a `card title` in the `card body`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Go to a item
    When I open the `gallery page`
    And I see an `item preview` in the `item previews grid`
    And I click an `item preview`
    Then I see an `item page`
