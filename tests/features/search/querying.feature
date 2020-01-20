Feature: Search querying

  Scenario: Redirect when no query parameter is present
    When I visit `/en/search`
    Then I should be on `/en/search?query=`

  Scenario: Search existing Europeana content
    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    Then I see "paris" in the `search box`
    And I should see 24 `search result`s
    And I see the `total results`
    And I am on an accessible page

  Scenario: Search non existing Europeana content
    When I visit a `search page`
    And I enter "no results for GIBBERISHABCDEFGHIJKLMONP" in the `search box`
    And I click the `search button`
    Then I don't have a `search result`
    And I see an `error notice` with the text "Error: No results"

  Scenario: Search with invalid query syntax
    When I visit a `search page`
    And I enter "*:*:*" in the `search box`
    And I click the `search button`
    Then I don't have a `search result`
    And I see an `error notice` with the text "Error"

  Scenario: Search and navigate to record
    When I visit a `search page`
    And I enter "paris" in the `search box`
    And I click the `search button`
    And I wait 2 seconds
    And I click a `search result`
    Then I see a `record page`
    And I don't see "paris" in the `search box`

  Scenario: Using auto suggestion with keyboard populates search field
    When I visit a `search page`
    And I enter "World" in the `search box`
    And I wait 1 second
    And I see `search suggestions` with the text "World War I"
    And I press the DOWN_ARROW key
    And I press the ENTER key
    And I wait 2 seconds
    Then I should be on the `"World War I" entity page`
    And there are no `search suggestions`
    And I don't see "World" in the `search box`

  Scenario: Pressing ESC will close the auto suggestion dropdown
    When I visit a `search page`
    And I enter "World" in the `search box`
    And I wait 1 second
    And I see `search suggestions` with the text "World War I"
    And I press the ESCAPE key
    Then I don't see `search suggestions`

  Scenario: No auto suggestion on entity pages
    Given I am on an `entity page`
    And I enter "World" in the `search box`
    And I wait 1 second
    Then there are no `search suggestions`

  Scenario: Back button restores previous query
    Given I am on the `home page`
    When I search for "frog"
    And I see the `search page`
    And I search for "spawn"
    And I wait 1 second
    And I go back
    And I wait 1 second
    Then I see "frog" in the `search box`
