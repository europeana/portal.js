Feature: Search content tier

  Scenario: Applies the content tier query to the URL when clicking the toggle button

    When I visit `/search?page=1&query=`
    And I click the `tier toggle button`
    And I wait 2 seconds
    Then I should be on `/search?page=1&qf=contentTier%3A%2a&query=&view=grid`
  
  Scenario: Removes the content tier query from the URL when clicking the toggle button

    When I visit `/search?page=1&qf=contentTier%3A%2a&query=`
    And I click the `tier toggle button`
    And I wait 2 seconds
    Then I should be on `/search?page=1&query=&view=grid`
