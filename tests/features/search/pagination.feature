Feature: Search pagination

  Scenario: Pagination of search results

    When I visit the `search page`
    And I enter "" in the `search box`
    And I click the `search button`
    Then I see a `pagination navigation`

  Scenario: Pagination links preserve query and facet selection.

    When I visit the `home page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I wait for a `search result`
    And I check the "IMAGE" checkbox
    And I wait 1 second
    Then I see a link to "/search?query=paris&page=2&qf=TYPE%3AIMAGE" in the `pagination navigation`

  Scenario: Pagination links preserve query and facet selection from the blank search page.

    When I visit the `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I wait for a `search result`
    And I check the "IMAGE" checkbox
    And I wait 1 seconds
    Then I see a link to "/search?query=paris&page=2&qf=TYPE%3AIMAGE" in the `pagination navigation`

  Scenario: Pagination links preserve query and facet selection from the url.

    When I visit the `/search?query=paris&page=1&qf=TYPE%3AIMAGE`
    Then I see a link to "/search?query=paris&page=2&qf=TYPE%3AIMAGE" in the `pagination navigation`

  Scenario: Pagination links work when the page was accessed from the url.

    When I visit `/search?query=paris&page=1&qf=TYPE%3AIMAGE`
    And I click the "/search?query=paris&page=2&qf=TYPE%3AIMAGE" link
    And I wait 1 second
    Then I should be on `/search?query=paris&page=2&qf=TYPE%3AIMAGE`

  Scenario: Invalid `page` param redirects to page 1

    When I open `/search?query=&page=-1`
    Then I should be on the `first page of results`

    When I open `/search?query=&page=0`
    Then I should be on the `first page of results`

    When I open `/search?query=&page=one`
    Then I should be on the `first page of results`

    When I open `/search?query=&page=last`
    Then I should be on the `first page of results`

    When I open `/search?query=&page=2.5`
    Then I should be on the `first page of results`

  Scenario: Paginating to the API result limit

    When I open `/search?query=&page=42`
    Then I see a `search result`
    Then I see an `info notice` with the text "Additional results are not shown as only the first 1000 most relevant results are shown. If you haven't found what you're looking for, please consider refining your search."

  Scenario: Paginating beyond API result limit

    When I open `/search?query=&page=500`
    Then I see an `error notice` with the text "It is only possible to view the first 1000 search results."

  Scenario: Paginating beyond available results

    When I open `/search?query=title%3Amilkmaid&page=10`
    Then I see a `warning notice` with the text "no more results"
    And I see a `pagination navigation`
