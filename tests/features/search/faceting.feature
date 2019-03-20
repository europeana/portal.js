Feature: Search faceting

  Scenario: Seeing the type facet

    When I visit the `search page`
    And I enter "" in the `search box`
    And I click the `search button`
    Then I see a `search facet` with the text "Type of media"

  Scenario: Filtering results by types

    When I visit `/search?query=`
    And I check the "IMAGE" checkbox
    And I wait 1 second
    Then I should be on `/search?query=&page=1&qf=TYPE%3AIMAGE`
    And I see a `filter badge` with the text "Type of media: IMAGE"
