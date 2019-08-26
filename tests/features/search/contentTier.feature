Feature: Search content tier

  Scenario: Applies the content tier query to the URL when clicking the toggle button

    When I visit the `/search?page=1&query=&view=list`
    And I wait 2 seconds
    And I click the `tier toggle button`
    And I wait 5 seconds
    Then I should be on `/search?page=1&qf=contentTier%3A%28%2a%29&query=&view=list`
  
  Scenario: Removes the content tier query from the URL when clicking the toggle button

    When I visit the `/search?page=1&qf=contentTier%3A%28%2a%29&query=&view=list`
    And I wait 2 seconds
    And I click the `tier toggle button`
    And I wait 5 seconds
    Then I should be on `/search?page=1&query=&view=list`
