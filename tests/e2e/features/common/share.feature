Feature: Gallery page

  Scenario: Sharing a gallery

    When I open the `gallery page`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`

  Scenario: Sharing an exhibition page

    When I open the `exhibition page`
    And  I click the `share button`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`

  Scenario: Sharing an exhibition chapter

    When I open the `exhibition chapter`
    And  I click the `share button`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`

  Scenario: Sharing an item

    When  I open an `item page`
    And  I click the `share button`
    Then I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`
