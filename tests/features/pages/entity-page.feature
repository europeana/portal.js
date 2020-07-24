Feature: Entity page

  Scenario: View any existing entity page
    When I open an `entity page`
    Then I see the `entity page`
    And I see an `entity title`
    And I don't have an `entity description`
    And I see `total results`
    And I see a `search list view toggle`
    And I see a `search bar pill`
    And I see a `search facet`
    And I should see 24 `search result`s
    And I see a `pagination navigation`
    And I don't have a `contentTier facet`
    And I am on an accessible page

  Scenario: Curated entity
    Given I am on `/en/collections/topic/190-art`
    Then I see an `entity description`

  Scenario: Attempting to view an entity page which doesn't exist
    When I open `/en/collections/person/123x-unknown`
    Then I see an `error notice`

  Scenario: View related entities
    When I open an `entity page`
    And I see the `entity page`
    Then I see `related entities`
    And I see the `Book entity card` in the `related entities`
    And I see the `Theatre entity card` in the `related entities`
    And I see the `Tragedy entity card` in the `related entities`
    And I see the `Drama entity card` in the `related entities`

  Scenario: Click on a related entity
    When I open an `entity page`
    And I see the `entity page`
    And I click an `Book entity card`
    And I wait for the page to load
    Then I should not be on the `entity page`

  Scenario: Navigating to a related item
    Given I am on an `entity page`
    And I see the `entity page`
    And I see a `search result`
    When I click a `search result`
    And I wait for the page to load
    Then I see an `item page`

  Scenario: Pagination links
    When I open an `entity page`
    And I see the `entity page`
    And I see a `search result`
    Then I see a link to "/en/collections/person/60305-william-shakespeare?page=2&view=grid" in the `pagination navigation`

  Scenario: Pagination links work when the page was accessed from the url
    When I visit `/en/collections/person/60305-william-shakespeare?page=2`
    And I go to page number 3
    And I wait for the page to load
    Then I should be on `/en/collections/person/60305-william-shakespeare?page=3&view=grid`

  # TODO: Add back - And I click the `search button` instead of press ENTER
  Scenario: Searching from an entity page searches within that entity
    When I open an `entity page`
    And I see the `entity page`
    And I see a `search result`
    And I enter "newspaper" in the `search box`
    And I press the ENTER key
    Then I see the `entity page`

  Scenario: Removing search pill
    When I open an `entity page`
    And I go to page number 2
    And I wait for the page to load
    And I am on page number 2
    And I see the `search bar pill`
    And I click the `search bar pill button`
    And I wait for the page to load
    Then I see the `search page`
    And I don't have the `search bar pill`
    And I am on page number 1
