Feature: Gallery page

  Scenario: Sharing a gallery

    When I open the `gallery page`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`

  Scenario: Sharing a record

    When  I open a `record page`
    And  I click the `share button`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`
