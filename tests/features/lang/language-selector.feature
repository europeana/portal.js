Feature: Select language 

  Scenario: Change language

    When I visit the `home page`
    And I click the `language selector`
    And I see a `Svenska language option` in the `language selector`
    And I click the `Svenska language option`
    And I wait 10 seconds
    Then I see the `browse section` with the text "Populära artister"
