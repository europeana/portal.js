Feature: Entity page

  Scenario: View any existing entity page

    When I open an `entity page`
    Then I see the `entity page`
    And I see an `entity title`

  Scenario: Attempting to view an entity page which doesn't exist

    When I open `/entity/person/123x-unknown`
    Then I see an `error notice`

  Scenario: View related entities

    When I open an `entity page`
    And I see the `entity page`
    Then I should have 2 `browse chip`s

  Scenario: Click on a related entity

    When I open an `entity page`
    And I see the `entity page`
    And I click a `browse chip`
    And I wait 2 seconds
    Then I should not be on the `entity page`

  Scenario: Viewing related records

    When I open an `entity page`
    And I see the `entity page`
    Then I see a `search result`

  Scenario: Navigating to a related record

    When I open an `entity page`
    And I see the `entity page`
    And I see a `search result`
    And I click a `search result`
    Then I see a `record page`

