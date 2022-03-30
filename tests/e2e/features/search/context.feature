Feature: Display the search results context

  Scenario: Viewing a collection without search terms
    When I visit the `Newspapers collection page`
    Then I see an `entity removal badge` with the text "Newspapers"
    And I don't have a `query removal badge`

  Scenario: Searching for terms (within a collection)
    When I visit the `Newspapers collection page`
    And I click the `show search button`
    And I enter "library" in the `search box`
    And I press the ENTER key
    Then I see an `entity removal badge` with the text "Newspapers"
    And I see a `query removal badge` with the text "library"

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
