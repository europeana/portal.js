Feature: Search content tier

  # TODO: tier toggles are disabled by default for now. When enabled, remove
  # this scenario, and uncomment the others.
  Scenario: Content tier toggle is disabled by default
    When I visit `/en/search?page=1&query=&view=grid`
    Then I don't have a `tier toggle`

  # Scenario: Applies the content tier query to the URL when clicking the toggle button
  #
  #   When I visit `/en/search?page=1&query=&view=grid`
  #   And I click the `tier toggle`
  #   Then I should be on `/en/search?page=1&query=&view=grid&qf=contentTier%3A%2a`
  #
  # Scenario: Removes the content tier query from the URL when clicking the toggle button
  #
  #   When I visit `/en/search?page=1&qf=contentTier%3A%2a&query=&view=grid`
  #   And I click the `tier toggle`
  #   Then I should be on `/en/search?page=1&query=&view=grid`
