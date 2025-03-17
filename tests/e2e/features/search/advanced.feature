Feature: Advanced search

  Scenario: Full-text search shows hit highlights
    Given I am on the `search page`
    And I click the `view toggle`
    And I click the `list view option`
    When I click the `toggle advanced search button`
    And I enter "first world war" in the `advanced search query builder: term control`
    And I click the `advanced search query builder: field control`
    And I click the `advanced search query builder: fulltext field option`
    And I click the `advanced search query builder: modifier control`
    And I click the `advanced search query builder: exact modifier option`
    And I wait for an `item preview`
    Then I see a `highlighted search term` with the text "First World War"
    And I am on an accessible page
