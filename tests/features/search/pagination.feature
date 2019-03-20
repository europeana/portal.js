Feature: Search pagination

  Scenario: Pagination of search results

    When I visit the `search page`
    And I enter "" in the `search box`
    And I click the `search button`
    Then I see a `pagination navigation`

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

  Scenario: Paginating beyond API result limit

    When I open `/search?query=&page=500`
    Then I see an `error notice` with the text "It is only possible to view the first 1000 search results."

  Scenario: Paginating beyond available results

    When I open `/search?query=title%3Amilkmaid&page=10`
    Then I see a `warning notice` with the text "no more results"
    And I see a `pagination navigation`
