Feature: Entity page

  Scenario: View any existing entity page
    When I open an `entity page`
    Then I see the `entity page`
    And I see an `entity title`
    And I don't have an `entity description`
    And I see `total results`
    And I see a `search list view toggle`
    And I see a `search facet`
    And I should see 24 `item preview`s
    And I see a `pagination navigation`
    And I don't have a `contentTier facet`
    And I am on an accessible page
    And I should have a Europeana branded page title

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
    And I see the `Book related chip` in the `related entities`
    And I see the `Theatre related chip` in the `related entities`
    And I see the `Tragedy related chip` in the `related entities`
    And I see the `Drama related chip` in the `related entities`

  Scenario: Click on a related entity
    When I open an `entity page`
    And I see the `entity page`
    And I click the `Book related chip`
    Then I should not be on the `entity page`

  Scenario: Navigating to a related item
    Given I am on an `entity page`
    And I see the `entity page`
    And I see a `item preview`
    When I click a `item preview`
    Then I see an `item page`

  Scenario: Pagination links
    When I open an `entity page`
    And I see the `entity page`
    And I see a `item preview`
    Then I see a link to "/en/collections/person/60305-william-shakespeare?page=2" in the `pagination navigation`

  Scenario: Pagination links work when the page was accessed from the url
    When I visit `/en/collections/person/60305-william-shakespeare?page=2`
    And I see the `pagination navigation`
    And I go to page number 3
    Then I should be on `/en/collections/person/60305-william-shakespeare?page=3`

  Scenario: Searching from an entity page searches within that entity, using keyboard
    When I open an `entity page`
    And I see the `entity page`
    And I see an `item preview`
    And I click the `show search button`
    And I enter "newspaper" in the `search box`
    And I press the ENTER key
    Then I see the `entity page`

  Scenario: Searching from an entity page searches within that entity, using the search button
    When I open an `entity page`
    And I see the `entity page`
    And I see an `item preview`
    And I click the `show search button`
    And I enter "newspaper" in the `search box`
    And I click the `search in collection button`
    Then I see the `entity page`

  Scenario: Leaving an Entity page
    When I open an `entity page`
    And I go to page number 2
    And I am on page number 2
    And I see the `entity title`
    And I click the `show search button`
    And I click the `search entire collection button`
    Then I see the `search page`
    And I don't have the `entity title`
