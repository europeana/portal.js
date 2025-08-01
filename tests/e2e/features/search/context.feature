Feature: Display the search results context

  Scenario: Searching for terms (without a collection)
    When I visit the `search page`
    And I click the `show search button`
    And I enter "library" in the `search box`
    And I press the ENTER key
    Then I see a `query removal badge` with the text "library"
    And I don't have an `entity removal badge`

  Scenario: Blank search
    When I visit the `search page`
    And I click the `show search button`
    And I press the ENTER key
    Then I don't have a `query removal badge`
    And I don't have an `entity removal badge`
