Feature: Search querying
  
  Scenario: Redirect when no query parameter is present
    When I visit `/search`
    Then I should be on `/search?query=`

  Scenario: Search existing Europeana content

    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    Then I see "paris" in the `search box`
    And I see a `search result`
    And I see the `total results`
    And I am on an accessible page

  Scenario: Search non existing Europeana content

    When I visit a `search page`
    And I enter "no results for GIBBERISHABCDEFGHIJKLMONP" in the `search box`
    And I click the `search button`
    Then I don't see a `search result`
    And I see an `error notice` with the text "Error: No results"

  Scenario: Search with invalid query syntax

    When I visit a `search page`
    And I enter "*:*:*" in the `search box`
    And I click the `search button`
    Then I don't see a `search result`
    And I see an `error notice` with the text "Error"

  Scenario: Search and navigate to record

    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I click a `search result`
    Then I see a `record page`
    And I don't see "paris" in the `search box`
