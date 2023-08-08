Feature: Advanced search

  Scenario: Full-text search shows hit highlights
    Given I am on the `Newspapers theme search page`
    And I click the `search list view toggle icon`
    When I click the `toggle advanced search button`
    And I enter "zeitung" in the `advanced search query builder: term control`
    And I click the `advanced search query builder: field control`
    And I click the `advanced search query builder: fulltext field option`
    And I click the `advanced search query builder: modifier control`
    And I click the `advanced search query builder: contains modifier option`
    Then I see a `highlighted search term` with the text "Zeitung"
