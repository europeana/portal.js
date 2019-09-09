Feature: Search content tier

  Scenario: Applies the content tier query to the URL when clicking the toggle button

    When I visit `/search?page=1&query=&view=grid`
    And I click the `tier toggle`
    And I wait 3 seconds
    Then I should be on `/search?page=1&query=&view=grid&qf=contentTier%3A%2a`

  Scenario: Removes the content tier query from the URL when clicking the toggle button

    When I visit `/search?page=1&qf=contentTier%3A%2a&query=&view=grid`
    And I click the `tier toggle`
    And I wait 3 seconds
    Then I should be on `/search?page=1&query=&view=grid`
