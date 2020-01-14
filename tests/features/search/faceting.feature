Feature: Search faceting

  Scenario: Filtering results by type
    Given I am on the `search page`
    When I click the `TYPE dropdown button`
    And I check the "IMAGE" "TYPE" checkbox
    And I click the `TYPE apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Type of media: Image"
    And I am on an accessible page

  Scenario: Filtering results by Collection

    When I visit the `search page`
    And I click the `THEME dropdown button`
    And I check the "art" "THEME" radio
    And I click the `THEME apply button`
    And I wait 4 seconds
    Then I should be on `/en/search?page=1&query=&view=grid&theme=art`
    And I see a `filter badge` with the text "Collection: Art"

  Scenario: No Collection filter on entity pages

    Given I am on an `entity page`
    Then I don't have a `THEME dropdown button`

  Scenario: Filtering results by reusability
    Given I am on the `search page`
    When I click the `REUSABILITY dropdown button`
    And I check the "open" "REUSABILITY" checkbox
    And I click the `REUSABILITY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&query=&reusability=open&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Can I reuse this?: Open"

  Scenario: Filtering results by country
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&query=&view=grid`
    And I am on page number 1
    And I see a `filter badge` with the text "Providing country: Belgium"

  Scenario: Filtering results by two countries
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I check the "Germany" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22&query=&view=grid`
    And I am on page number 1
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
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
    Given I am on `/en/search?query=&page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s

  Scenario: Unselecting facets
    Given I am on `/en/search?query=&page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    When I click the `COUNTRY dropdown button`
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
    And I can't have a `/en/search?query=`

  Scenario: Filtering results by country and have a corresponding record page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 2 seconds
    And I click a `search result`
    And I wait 2 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding record page
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
    And I check the "Belgium" "COUNTRY" checkbox
    And I check the "Germany" "COUNTRY" checkbox
    And I click the `COUNTRY apply button`
    And I wait 3 seconds
    And I click a `search result`
    And I wait 3 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium" or the value "Germany"

  Scenario: Preserve filtering when performing a new search
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
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
    Given I am on the `search page`
    When I click the `TYPE dropdown button`
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

  Scenario: Toggle show all options in More Filters facet
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I should see 9 `Language` checkboxes
    And I click the `Show all languages button`
    Then I should see 37 `Language` checkboxes
    And I click the `Show less languages button`
    And I should see 9 `Language` checkboxes

  Scenario: Filtering results using the more facets dropdown
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I check the "en" "Language" checkbox
    And I check the "sv" "Language" checkbox
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&qf=LANGUAGE%3A%22en%22&qf=LANGUAGE%3A%22sv%22&query=&view=grid`
    And I see a `more filters selected options count` with the text "2"

  Scenario: Filtering results using the date filter in more facets dropdown
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/entity/topic/18-newspaper?page=1&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D&view=grid&api=fulltext`

  Scenario: Newspapers collection API toggle defaults to fulltext
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    Then the "fulltext" "api" radio is checked

  Scenario: Newspapers collection API toggle changes API
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I click the "metadata" "api" radio
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/entity/topic/18-newspaper?page=1&view=grid&api=metadata`

  Scenario: Newspapers collection API toggle is removed when switching collection
    Given I am on `/en/search?page=1&query=&view=grid&theme=newspaper&api=fulltext`
    When I click the `THEME dropdown button`
    And I check the "music" "THEME" radio
    And I click the `THEME apply button`
    And I wait 3 seconds
    Then I should be on `/en/search?page=1&query=&view=grid&theme=music`

  Scenario: Newspapers collection API toggle is removed by reset button
    Given I am on `/en/search?page=1&query=&view=grid&theme=newspaper&api=fulltext`
    When I click the `reset filters button`
    And I wait 3 seconds
    Then I should be on `/en/search?page=1&query=&view=grid`

  Scenario: Clicking reset button in more facets
    Given I am on the `search page`
    When I click the `more filters dropdown button`
    And I check the "en" "Language" checkbox
    And I check the "sv" "Language" checkbox
    And I click the `apply button`
    And I wait 2 seconds
    And I click the `more filters dropdown button`
    And I click the `reset filter button`
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/search?page=1&query=&view=grid`

  Scenario: Clear filters using using `clear all filter` button
    Given I am on the `search page`
    When I click the `COUNTRY dropdown button`
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

  Scenario: Non-core/non-more filters excluded from options count
    Given I am on `/en/search?qf=proxy_dcterms_alternative:*`
    Then I don't have a `more filters selected options count`
