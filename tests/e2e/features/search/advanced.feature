Feature: Advanced search

  Scenario: Full-text search shows hit highlights
    Given I am on the `search page`
    And I click the `search list view toggle icon`
    When I click the `toggle advanced search button`
    And I enter "first world war" in the `advanced search query builder: term control`
    And I click the `advanced search query builder: field control`
    And I click the `advanced search query builder: fulltext field option`
    And I click the `advanced search query builder: modifier control`
    And I click the `advanced search query builder: exact modifier option`
    And I wait for an `item preview`
    Then I see a `highlighted search term` with the text "First World War"
    And I am on an accessible page

  Scenario: Full-text search on a collection page shows hit highlights
    When I open an `entity page`
    And I click the `search list view toggle icon`
    When I click the `toggle advanced search button`
    And I enter "paris" in the `advanced search query builder: term control`
    And I click the `advanced search query builder: field control`
    And I click the `advanced search query builder: fulltext field option`
    And I click the `advanced search query builder: modifier control`
    And I click the `advanced search query builder: exact modifier option`
    And I wait for an `item preview`
    Then I see a `highlighted search term` with the text "paris"
    And I am on an accessible page
