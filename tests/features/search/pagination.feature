Feature: Search pagination

  Scenario: Invalid `page` param redirects to page 1

    When I open `/search?page=-1`
    Then I should be on `/search?page=1`

    When I open `/search?page=0`
    Then I should be on `/search?page=1`

    When I open `/search?page=one`
    Then I should be on `/search?page=1`

    When I open `/search?page=last`
    Then I should be on `/search?page=1`

    When I open `/search?page=2.5`
    Then I should be on `/search?page=1`
