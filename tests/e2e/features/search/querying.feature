Feature: Search querying

  # TODO: Add back - And I click the `search button` instead of press ENTER

  Scenario: Search existing Europeana content
    When I visit a `search page`
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key

    And I see a `context label` with the text "paris"
    And I see "paris" in the `search box`
    And I don't see a `loading spinner`
    And I see the `context label`
    And I should see 24 `item preview`s
    And I am on an accessible page

  Scenario: Search non existing Europeana content
    When I visit a `search page`
    And I click the `show search button`
    And I enter "no results for GIBBERISHABCDEFGHIJKLMONP" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "no results for GIBBERISHABCDEFGHIJKLMONP"
    Then I don't have a `item preview`
    And I see an `error explanation` with the text "We can't seem to find what you are looking for."

  Scenario: Search and navigate to item
    When I visit a `search page`
    And I click the `show search button`
    And I enter "paris" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "paris"
    And I click a `item preview`
    Then I see an `item page`
    And I click the `show search button`
    And I don't see "paris" in the `search box`

  Scenario: Using auto suggestion with keyboard populates search field
    Given I am on the `home page`
    And I click the `show search button`
    And I enter "World" in the `search box`
    And I see `search query options` with the text "World War I"
    And I press the DOWN_ARROW key
    And the `search entire collection button` is highlighted
    And I press the DOWN_ARROW key
    And I press the DOWN_ARROW key
    And the `World War I search suggestion` is highlighted
    And I press the ENTER key
    Then I see the `search page`
    And I see "\"World War I\"" in the `search box`

  Scenario: Pressing ESC will close the auto suggestion facet dropdown
    When I visit a `search page`
    And I click the `show search button`
    And I enter "World" in the `search box`
    And I see `search query options` with the text "World War I"
    And I press the ESCAPE key
    Then I don't see `search query options`

  Scenario: No auto suggestion on entity pages, only the search buttons
    Given I am on an `entity page`
    And I click the `show search button`
    And I enter "World" in the `search box`
    And I wait 1 second
    Then I see `search query options`
    And there is no `World war I search suggestion`

  Scenario: Back button restores previous query
    Given I am on the `home page`
    And I click the `show search button`
    And I enter "frog" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "frog"
    And I enter "spawn" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "spawn"
    And I go back
    And I wait 1 second
    Then I see "frog" in the `search box`
    And I don't see the `search query options`

  Scenario: Search form on a searchable page with a query
    When I visit a `search page with a search query`
    And I see a `search box`
    And I see "art" in the `search box`
    And I don't see the `search query options`

  Scenario: Clearing the search form
    When I visit a `search page with a search query`
    And I see "art" in the `search box`
    And I click the `clear button`
    And I don't see "art" in the `search box`

  Scenario: Clicking outside the search form
    When I visit a `search page with a search query`
    And I enter "frog" in the `search box`
    And I click the `search sidebar`
    Then I see a `context label` with the text "frog"
    And I enter "spawn" in the `search box`
    And I click a `item preview`
    Then I see an `item page`
    