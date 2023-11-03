Feature: Advanced search

  Scenario: Full-text search shows hit highlights
    Given I am on the `Newspapers theme search page`
    And I click the `search list view toggle icon`
    When I click the `toggle advanced search button`
    And I take a screenshot named "advanced-search-fulltext-1"
    And I click the `advanced search query builder: field control`
    And I take a screenshot named "advanced-search-fulltext-2"
    And I click the `advanced search query builder: fulltext field option`
    And I take a screenshot named "advanced-search-fulltext-3"
    And I click the `advanced search query builder: modifier control`
    And I take a screenshot named "advanced-search-fulltext-4"
    And I click the `advanced search query builder: contains modifier option`
    And I take a screenshot named "advanced-search-fulltext-5"
    And I click the `advanced search query builder: term control`
    And I take a screenshot named "advanced-search-fulltext-6"
    And I enter "zeitung" in the `advanced search query builder: term control`
    And I take a screenshot named "advanced-search-fulltext-7"
    And I press the ENTER key
    Then I see a `highlighted search term` with the text "Zeitung"
