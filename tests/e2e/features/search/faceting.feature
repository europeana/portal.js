Feature: Search faceting

  Scenario: Filtering results by type
    Given I am on the `search page`
    When I click the `TYPE facet dropdown`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22`
    And I am on page number 1
    And I see a `filter badge` with the text "Image"
    And I am on an accessible page

  Scenario: Filtering results by Collection

    When I visit the `search page`
    And I click the `collection facet dropdown`
    And I check the "art" "collection" radio
    Then I should be on `/en/search?page=1&qf=collection%3Aart`
    And I see a `filter badge` with the text "Art"

  Scenario: Filtering results by Collection and paginate

    When I visit the `search page`
    And I click the `collection facet dropdown`
    And I check the "art" "collection" radio
    And I am on page number 1
    And I go to page number 2
    Then I am on page number 2

  Scenario: No Collection filter on entity pages

    Given I am on an `entity page`
    Then I don't have a `collection facet dropdown`

  Scenario: Reusability options
    Given I am on the `search page`
    When I click the `REUSABILITY facet dropdown`
    Then I see an `open REUSABILITY field`
    And I see a `permission REUSABILITY field`
    And I see a `restricted REUSABILITY field`
    And I don't have an `uncategorized REUSABILITY field`

  Scenario: Filtering results by reusability
    Given I am on the `search page`
    When I click the `REUSABILITY facet dropdown`
    And I check the "open" "REUSABILITY" checkbox
    Then I should be on `/en/search?page=1&reusability=open`
    And I am on page number 1
    And I see a `filter badge` with the text "Yes"

  Scenario: Filtering results by country
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22`
    And I am on page number 1
    And I see a `filter badge` with the text "Belgium"

  Scenario: Filtering results by two countries
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I check the "\"Germany\"" "COUNTRY" checkbox
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22`
    And I am on page number 1
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `REUSABILITY facet dropdown`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `TYPE facet dropdown`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22&reusability=open`
    And I am on page number 1
    And I should have 3 `filter badge`s

  Scenario: Facets are loaded from the URL
    Given I am on `/en/search?page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s

  Scenario: Unselecting facets
    Given I am on `/en/search?page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `REUSABILITY facet dropdown`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `TYPE facet dropdown`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    Then I should be on `/en/search?page=1`
    And I am on page number 1

  Scenario: Filtering results by country and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22`
    And I click an `item preview`
    Then I see an `item page`
    And I click the "All metadata" tab
    Then I should see a metadata field for edmCountry with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I check the "\"Germany\"" "COUNTRY" checkbox
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22`
    And I click an `item preview`
    Then I see an `item page`
    And I click the "All metadata" tab
    Then I should see a metadata field for edmCountry with the value "Belgium" or the value "Germany"

  # TODO: Add back - And I click the `search button` instead of press ENTER
  Scenario: Preserve filtering when performing a new search
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"France\"" "COUNTRY" checkbox
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22`
    And I see a `filter badge` with the text "France"
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    Then I see a `search query` with the text "paris"
    And I am on page number 1
    And I see a `filter badge` with the text "France"
    And I should have 1 `filter badge`

  Scenario: Paginating with facets
    Given I am on the `search page`
    When I click the `TYPE facet dropdown`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I go to page number 2
    And I am on page number 2
    And I hover over the `TYPE facet dropdown`
    And I click the `TYPE facet dropdown`
    And I check the "\"VIDEO\"" "TYPE" checkbox
    And I don't have a `loading spinner`
    Then I am on page number 1

  Scenario: Clear filters using reset button
    Given I am on the `search page`
    When I click the `COUNTRY facet dropdown`
    And I check the "\"France\"" "COUNTRY" checkbox
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22`
    And I click the `TYPE facet dropdown`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22`
    And I go to page number 2
    And I should be on `/en/search?page=2&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22`
    And the `reset filters button` is "enabled"
    And I click the `reset filters button`
    Then I should be on `/en/search?page=1`
