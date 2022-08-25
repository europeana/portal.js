Feature: Gallery page

  Scenario: View a gallery

    When I open the `gallery page`
    Then I see a `page title`
    And I see a `content card` in the `gallery images`
    And I see a `card title` in the `card body`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Go to a item
    When I open the `gallery page`
    Then I see a `content card` in the `gallery images`
    And I click a `content card`
    Then I see an `item page`
