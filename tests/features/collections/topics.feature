Feature: Topics listing page

  Scenario: View an index of topics

    When I visit the `topics listing page`
    Then I see a `pagination navigation`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Opening a topic

    When I visit the `topics listing page`
    And I click a `content card`
    Then I see an `entity page`
