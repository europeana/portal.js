Feature: Search pagination

  # TODO: Add back - And I click the `search button` instead of press ENTER

  Scenario: Pagination of search results

    When I visit the `search page`
    And I click the `show search button`
    And I enter "" in the `search box`
    And I press the ENTER key
    Then I see a `pagination navigation`
    And I am on an accessible page

  Scenario: Pagination links preserve query and facet selection.

    When I visit the `home page`
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    And I see a `search query` with the text "paris"
    And I wait for a `item preview`
    And I see a `search facet`
    And I click the `TYPE dropdown button`
    And I check the "\"IMAGE\"" "TYPE" checkbox
    And I click the `TYPE apply button`
    Then I should be on `/en/search?page=1&qf=TYPE%3A%22IMAGE%22&query=paris&view=grid`
    And I see a link to "/en/search?page=2&qf=TYPE%3A%22IMAGE%22&query=paris&view=grid" in the `pagination navigation`

  Scenario: Changing pagination with browser history

    Given I am on the `home page`
    When I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    And I see a `search query` with the text "paris"
    And I go to page number 2
    And I am on page number 2
    And I go back
    Then I am on page number 1

  Scenario: Pagination links preserve query and facet selection from the url.

    When I visit `/en/search?query=paris&page=1&qf=TYPE%3A%22IMAGE%22`
    Then I see a link to "/en/search?query=paris&page=2&qf=TYPE%3A%22IMAGE%22" in the `pagination navigation`

  Scenario: Pagination links work when the page was accessed from the url.
    Given I am on `/en/search?query=paris&page=1&qf=TYPE%3A%22IMAGE%22`
    When I go to page number 2
    Then I am on page number 2
    Then I should be on `/en/search?query=paris&page=2&qf=TYPE%3A%22IMAGE%22`

  Scenario: Invalid `page` param redirects to page 1

    When I open `/en/search?page=-1`
    Then I should be on the `first page of results`

    When I open `/en/search?page=0`
    Then I should be on the `first page of results`

    When I open `/en/search?page=one`
    Then I should be on the `first page of results`

    When I open `/en/search?page=last`
    Then I should be on the `first page of results`

    When I open `/en/search?page=2.5`
    Then I should be on the `first page of results`

  Scenario: Paginating to the API result limit

    When I open `/en/search?page=42`
    Then I see a `item preview`
    Then I see an `info notice` with the text "Additional results are not shown as only the first 1000 most relevant results are shown. If you haven't found what you're looking for, please consider refining your search."
    And I am on an accessible page

  Scenario: Paginating beyond API result limit

    When I open `/en/search?page=500`
    Then I see an `error notice` with the text "It is only possible to view the first 1,000 search results."
    And I am on an accessible page

  Scenario: Paginating beyond available results

    When I open `/en/search?query=title%3Amountain%20fort&page=10`
    Then I see a `warning notice` with the text "no more results"
    And I see a `pagination navigation`
