Feature: Search

  Scenario: Search existing Europeana content

    Given I visit a `search page`
    When I enter "paris" in the `search box`
    And I click the `search button`
    Then I see a `result`

  Scenario: Search non existing Europeana content

    Given I visit a `search page`
    When I enter "no results for GIBBERISHABCDEFGHIJKLMONP" in the `search box`
    And I click the `search button`
    Then I don't see a `result`

  Scenario: Search with invalid query syntax

    Given I visit a `search page`
    When I enter "*:*:*" in the `search box`
    And I click the `search button`
    Then I don't see a `result`
    And I see an `error notice`

  Scenario: Search and navigate to record

    Given I visit a `search page`
    When I enter "paris" in the `search box`
    And I click the `search button`
    And I see a `result`
    And I click a `result`
    Then I see a `record page`
