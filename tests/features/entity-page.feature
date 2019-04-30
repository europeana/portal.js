Feature: Entity page

  Scenario: View any existing entity page

    When I open an `entity page`
    Then I see the `entity page`
    And I see an `entity title`

  Scenario: Attempting to view an entity page which doesn't exist

    When I open `/entity/person/123x-unknown`
    Then I see an `error notice`
