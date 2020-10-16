Feature: Search faceting

  Scenario: Filtering results by type
    Given I am on the `search page`
    When I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Type of media: Image"
    And I am on an accessible page

  Scenario: Filtering results by Collection

    When I visit the `search page`
    And I click the `collection dropdown button`
    And I check the "art" "collection" radio
    And I click the `collection apply button`
    Then I should be on `/en/search?page=1&qf=collection%3Aart&query=&view=grid`
    And I see a `filter badge` with the text "Collection: Art"

  Scenario: Filtering results by Collection and paginate

    When I visit the `search page`
    And I click the `collection dropdown button`
    And I check the "art" "collection" radio
    And I click the `collection apply button`
    And I am on page number 1
    And I go to page number 2
    Then I am on page number 2

  Scenario: No Collection filter on entity pages

    Given I am on an `entity page`
    Then I don't have a `collection dropdown button`

  Scenario: Reusability options
    Given I am on the `search page`
    When I click the `REUSABILITY dropdown button`
    Then I see an `open REUSABILITY field`
    And I see a `permission REUSABILITY field`
    And I see a `restricted REUSABILITY field`
    And I don't have an `uncategorized REUSABILITY field`

  Scenario: Filtering results by reusability
    Given I am on the `search page`
    When I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    Then I should be on `/en/search?page=1&query=&reusability=open&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Can I use this?: Yes"

  Scenario: Filtering results by country
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Providing country: Belgium"

  Scenario: Filtering results by two countries
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I check the "\"Germany\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22&query=&view=grid`
    And I am on page number 1
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22&query=&reusability=open&view=grid`
    And I am on page number 1
    And I should have 3 `filter badge`s

  Scenario: Facets are loaded from the URL
    Given I am on `/en/search?query=&page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s

  Scenario: Unselecting facets
    Given I am on `/en/search?query=&page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    Then I should be on `/en/search?page=1&query=&view=grid`
    And I am on page number 1
    And I can't have a `/en/search?query=`

  Scenario: Filtering results by country and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I see a `item preview`
    And I click a `item preview`
    Then I see an `item page`
    And I should see a meta label `Providing country` with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding item page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"Belgium\"" "COUNTRY" checkbox
    And I check the "\"Germany\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click a `item preview`
    Then I see an `item page`
    And I should see a meta label `Providing country` with the value "Belgium" or the value "Germany"

  # TODO: Add back - And I click the `search button` instead of press ENTER
  Scenario: Preserve filtering when performing a new search
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"France\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&query=&view=grid`
    And I see a `filter badge` with the text "Providing country: France"
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    Then I see a `search query` with the text "paris"
    And I am on page number 1
    And I see a `filter badge` with the text "Providing country: France"
    And I should have 1 `filter badge`

  Scenario: Paginating with facets
    Given I am on the `search page`
    When I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I go to page number 2
    And I am on page number 2
    And I click the `TYPE dropdown button`
    And I check the "\"VIDEO\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    Then I am on page number 1

  Scenario: Toggle show all options in More Filters facet
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I should see 9 LANGUAGE checkboxes
    And I click the `Show all languages button`
    Then I should see 37 LANGUAGE checkboxes
    And I click the `Show less languages button`
    And I should see 9 LANGUAGE checkboxes

  Scenario: Filtering results using the more facets dropdown
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I check the "\"en\"" "LANGUAGE" checkbox
    And I check the "\"sv\"" "LANGUAGE" checkbox
    And I click the `apply button`
    Then I should be on `/en/search?page=1&qf=LANGUAGE%3A%22en%22&qf=LANGUAGE%3A%22sv%22&query=&view=grid`
    And I see a `more filters selected options count` with the text "2"

  Scenario: Applies the content tier query to the URL when clicking the toggle button
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I check the "\"0\"" "contentTier" checkbox
    And I click the `apply button`
    Then I should be on `/en/search?page=1&qf=contentTier%3A%220%22&query=&view=grid`

  Scenario: Clicking reset button in more facets
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I check the "\"en\"" "LANGUAGE" checkbox
    And I check the "\"sv\"" "LANGUAGE" checkbox
    And I click the `apply button`
    And I click the `more filters dropdown button`
    And I click the `reset filter button`
    And I click the `apply button`
    Then I should be on `/en/search?page=1&query=&view=grid`

  Scenario: No tier filter on entity pages
    Given I am on an `entity page`
    When I click the `more filters dropdown button`
    Then I don't have a `contentTier facet`

  Scenario: A tier filter on search page
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    Then I see a `contentTier facet`

  Scenario: No tier filter on search page when collection is applied
    Given I am on the `search page`
    And I click the `collection dropdown button`
    And I check the "fashion" "collection" radio
    And I click the `collection apply button`
    Then I don't have a `contentTier facet`

  Scenario: Clear filters using `clear all filter` button
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "\"France\"" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I should be on `/en/search?page=1&qf=COUNTRY%3A%22France%22&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I go to page number 2
    And I click the `reset filters button`
    Then I should be on `/en/search?page=1&query=&view=grid`

  Scenario: Non-core/non-more filters excluded from options count
    Given I am on `/en/search?qf=proxy_dcterms_alternative:*`
    Then I don't have a `more filters selected options count`
