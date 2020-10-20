Feature: Search faceting

  Scenario: Filtering results by country and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I see a `item preview`
    And I click a `item preview`
    Then I see an `item page`
    And I click tab number 2
    And I should see a meta label `Providing country` with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I check the "\"Germany\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click a `item preview`
    Then I see an `item page`
    And I click tab number 2
    And I should see a meta label `Providing country` with the value "Belgium" or the value "Germany"
