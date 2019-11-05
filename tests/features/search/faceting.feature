Feature: Search faceting

  Scenario: Filtering results by type

    When I visit the `search page`
    And I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Type of media: IMAGE"
    And I am on an accessible page

  Scenario: Filtering results by reusability

    When I visit the `search page`
    And I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&query=&reusability=open&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Can I reuse this?: open"

  Scenario: Filtering results by country

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Providing country: Belgium"

  Scenario: Filtering results by two countries

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I check the "Germany" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22&query=&view=grid`
    And I am on page number 1
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22&query=&reusability=open&view=grid`
    And I am on page number 1
    And I should have 3 `filter badge`s

  Scenario: Facets are loaded from the URL

    When I visit `/en/search?query=&page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s

  Scenario: Unselecting facets

    When I visit `/en/search?query=&page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&query=&view=grid`
    And I am on page number 1
    And I can't see a `/en/search?query=`

  Scenario: Filtering results by country and have a corresponding record page

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    And I click a `search result`
    And I wait 2 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding record page

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I check the "Germany" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 3 seconds
    And I click a `search result`
    And I wait 3 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium" or the value "Germany"

  Scenario: Preserve filtering when performing a new search

    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "France" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I wait 3 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&query=paris&view=grid`
    And I am on page number 1
    And I should have 1 `filter badge`

  Scenario: Paginating with facets

    When I visit the `search page`
    And I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I wait 2 seconds
    And I go to page number 2
    And I wait 2 seconds
    And I am on page number 2
    And I click the `TYPE dropdown button`
    And I check the "VIDEO" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I wait 2 seconds
    Then I am on page number 1

  Scenario: Clear filters using using `clear all filter` button
    When I visit the `search page`
    And I click the `COUNTRY dropdown button`
    And I check the "France" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I wait 2 seconds
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I go to page number 2
    And I click the `reset filters button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&query=&view=grid`
