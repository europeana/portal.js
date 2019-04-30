Feature: Search querying

  Scenario: Search existing Europeana content

    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    Then I see a `search result`
    And I see the `total results`

  Scenario: Search non existing Europeana content

    When I visit a `search page`
    And I enter "no results for GIBBERISHABCDEFGHIJKLMONP" in the `search box`
    And I click the `search button`
    Then I don't see a `search result`
    And I don't see a `warning notice`

  Scenario: Search with invalid query syntax

    When I visit a `search page`
    And I enter "*:*:*" in the `search box`
    And I click the `search button`
    Then I don't see a `search result`
    And I see an `error notice` with the text "Error: Invalid query parameter."

  Scenario: Search and navigate to record

    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I click a `search result`
    Then I see a `record page`
