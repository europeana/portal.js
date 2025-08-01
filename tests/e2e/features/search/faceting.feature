Feature: Search faceting

  Scenario: Filtering results by type
    Given I am on the `search page`
    When I click the `TYPE side facet dropdown button`
    And I click the `IMAGE TYPE field`
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22`
    And I am on page number 1
    And I see a `filter badge` with the text "Image"
    And I am on an accessible page
    And I find a `results status message`

  Scenario: Filtering results by Collection
    When I visit the `search page`
    And I click the `collection side facet dropdown button`
    And I click the `art collection field`
    Then I should be on `/en/search?page=1&qf=collection%3Aart`
    And I see a `filter badge` with the text "Art"

  Scenario: Filtering results by Collection and paginate
    When I visit the `search page`
    And I click the `collection side facet dropdown button`
    And I click the `art collection field`
    And I am on page number 1
    And I go to page number 2
    Then I am on page number 2

  Scenario: No Collection filter on entity pages
    Given I am on an `entity page`
    Then I don't have a `collection facet dropdown`

  Scenario: Reusability options
    Given I am on the `search page`
    When I click the `REUSABILITY side facet dropdown button`
    Then I see an `open REUSABILITY field`
    And I see a `permission REUSABILITY field`
    And I see a `restricted REUSABILITY field`
    And I don't have an `uncategorized REUSABILITY field`

  Scenario: Filtering results by reusability
    Given I am on the `search page`
    When I click the `REUSABILITY side facet dropdown button`
    And I click the `open REUSABILITY field`
    Then I should be on `/en/search?page=1&reusability=open`
    And I am on page number 1
    And I see a `filter badge` with the text "Yes"

  Scenario: Filtering results by country
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Belgium COUNTRY field`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22`
    And I am on page number 1
    And I see a `filter badge` with the text "Belgium"

  Scenario: Filtering results by rights statement
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `RIGHTS side facet dropdown button`
    And I click the `*/publicdomain/mark/* RIGHTS field`
    Then I should be on `/en/search?page=1&qf=RIGHTS%3A%2A%2Fpublicdomain%2Fmark%2F%2A`
    And I am on page number 1
    And I see a `filter badge` with the text "Public Domain Mark"

  Scenario: Filtering beyond the first 50 facet values using facet search
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `PROVIDER side facet dropdown button`
    And I click the `more facet values available button`
    And I enter "The European Library" in the `side facet dropdown search input`
    And I click the `The European Library PROVIDER field`
    And I don't see a `loading spinner`
    Then I should be on `/en/search?page=1&qf=PROVIDER%3A%22The%20European%20Library%22`

  Scenario: Filtering results by two countries
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Belgium COUNTRY field`
    And I don't see a `loading spinner`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Germany COUNTRY field`
    And I don't see a `loading spinner`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22`
    And I am on page number 1
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Belgium COUNTRY field`
    And I don't see a `loading spinner`
    And I click the `REUSABILITY side facet dropdown button`
    And I click the `open REUSABILITY field`
    And I don't see a `loading spinner`
    And I click the `TYPE side facet dropdown button`
    And I click the `IMAGE TYPE field`
    And I don't see a `loading spinner`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22&reusability=open`
    And I am on page number 1
    And I should have 3 `filter badge`s

  Scenario: Facets are loaded from the URL
    Given I am on `/en/search?page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s
    And I see the `additional filters toggle` with the text "HIDE ADDITIONAL FILTERS"

  Scenario: Unselecting a facet
    Given I am on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22`
    And I see a `filter badge` with the text "Belgium"
    And I click the `filter badge` button
    Then I should be on `/en/search?page=1`
    And I am on page number 1

  Scenario: Filtering results by country and have a corresponding item page
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Belgium COUNTRY field`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22`
    And I click an `item preview`
    Then I see an `item page`
    And I click the `all metadata tab`
    Then I should see a metadata field for edmCountry with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding item page
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Belgium COUNTRY field`
    And I don't see a `loading spinner`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `Germany COUNTRY field`
    And I don't see a `loading spinner`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22`
    And I click an `item preview`
    Then I see an `item page`
    And I click the `all metadata tab`
    Then I should see a metadata field for edmCountry with the value "Belgium" or the value "Germany"

  # TODO: Add back - And I click the `search button` instead of press ENTER
  Scenario: Preserve filtering when performing a new search
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `France COUNTRY field`
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22`
    And I see a `filter badge` with the text "France"
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    Then I see a `context label` with the text "paris"
    And I am on page number 1
    And I see a `filter badge` with the text "France"
    And I should have 1 `filter badge`

  Scenario: Paginating with facets
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `TYPE side facet dropdown button`
    And I click the `IMAGE TYPE field`
    And I see a `filter badge` with the text "Image"
    And I go to page number 2
    And I am on page number 2
    And I don't see a `loading spinner`
    Then I click the `TYPE side facet dropdown button`
    And I click the `VIDEO TYPE field`
    Then I am on page number 1

  Scenario: Clear filters using reset button
    Given I am on the `search page`
    When I click the `additional filters toggle`
    And I click the `COUNTRY side facet dropdown button`
    And I click the `France COUNTRY field`
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22`
    And I don't see a `loading spinner`
    And I click the `TYPE side facet dropdown button`
    And I click the `IMAGE TYPE field`
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22`
    And I go to page number 2
    And I should be on `/en/search?page=2&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22`
    And I don't see a `loading spinner`
    And the `reset filters button` is "enabled"
    And I hover over the `reset filters button`
    And I click the `reset filters button`
    Then I should be on `/en/search?page=1`
