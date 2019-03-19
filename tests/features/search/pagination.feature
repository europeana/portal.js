Feature: Search pagination

  Scenario: Invalid `page` param redirects to page 1

    When I open `/search?query=&page=-1`
    Then I should be on `/search?query=&page=1`

    When I open `/search?query=&page=0`
    Then I should be on `/search?query=&page=1`

    When I open `/search?query=&page=one`
    Then I should be on `/search?query=&page=1`

    When I open `/search?query=&page=last`
    Then I should be on `/search?query=&page=1`

    When I open `/search?query=&page=2.5`
    Then I should be on `/search?query=&page=1`

  Scenario: Paginating beyond API result limit

    When I open `/search?query=&page=500`
    Then I see an `error notice` with text "It is only possible to view the first 1000 search results."

  Scenario: Paginating beyond available results

    When I open `/search?query=europeana_id%3A"%2F90402%2FSK_A_2344"&page=2`
    Then I see a `warning notice` with text "no more results"
