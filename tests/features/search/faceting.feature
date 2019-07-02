Feature: Search faceting

  Scenario: Seeing the type facet

    When I visit the `search page`
    And I enter "" in the `search box`
    And I click the `search button`
    Then I see a `search facet` with the text "Type of media"

  Scenario: Filtering results by types

    When I visit `/search?query=`
    And I check the "IMAGE" checkbox
    And I wait 2 seconds
    Then I should be on `/search?page=1&qf=TYPE%3A%22IMAGE%22&query=&view=grid`
    And I see a `filter badge` with the text "Type of media: IMAGE"
    And I am on an accessible page

  Scenario: Filtering results by reusability

    When I visit `/search?query=`
    And I check the "open" checkbox
    And I wait 2 seconds
    Then I should be on `/search?page=1&query=&reusability=open&view=grid`
    And I see a `filter badge` with the text "Can I reuse this?: open"

  Scenario: Filtering results by country

    When I visit `/search?query=`
    And I check the "Belgium" checkbox
    And I wait 2 seconds
    Then I should be on `/search?page=1&qf=COUNTRY%3A%22Belgium%22&query=&view=grid`
    And I see a `filter badge` with the text "Country: Belgium"

  Scenario: Filtering results by two countries

    When I visit `/search?query=`
    And I check the "Belgium" checkbox
    And I check the "Germany" checkbox
    And I wait 2 seconds
    Then I should be on `/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=COUNTRY%3A%22Germany%22&query=&view=grid`
    And I should have 2 `filter badge`s

  Scenario: Filtering using a combination of facet fields

    When I visit the `/search?query=`
    And I check the "Belgium" checkbox
    And I check the "IMAGE" checkbox
    And I check the "open" checkbox
    And I wait 2 seconds
    Then I should be on `/search?page=1&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22&query=&reusability=open&view=grid`
    And I should have 3 `filter badge`s

  Scenario: Facets are loaded from the URL

    When I visit `/search?query=&page=1&reusability=open&qf=COUNTRY%3A%22Belgium%22&qf=TYPE%3A%22IMAGE%22`
    Then I should have 3 `filter badge`s

  Scenario: Unselecting facets

    When I visit `/search?query=&page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    And I check the "Belgium" checkbox
    And I check the "IMAGE" checkbox
    And I check the "open" checkbox
    And I wait 2 seconds
    Then I should be on `/search?query=&page=1&reusability=open&view=grid`
    And I can't see a `/search?query=`

  Scenario: Filtering results by country and have a corresponding record page

    When I visit `/search?query=`
    And I check the "Belgium" checkbox
    And I wait 2 seconds
    And I click a `search result`
    And I wait 2 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium"

  Scenario: Filtering results by two countries and have a corresponding record page

    When I visit `/search?query=`
    And I check the "Belgium" checkbox
    And I check the "Germany" checkbox
    And I wait 2 seconds
    And I click a `search result`
    And I wait 2 seconds
    Then I see a `record page`
    And I should see a meta label `Providing country` with the value "Belgium" or the value "Germany"
