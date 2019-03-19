Feature: Search faceting

  Scenario: Seeing the type facet

    When I visit the `search page`
    And I enter "" in the `search box`
    And I click the `search button`
    Then I see a `search facet` with text "Type of media"

  Scenario: Filtering results by types

    When I visit `/search?query=`
    And I check the "IMAGE" checkbox
    Then I should be on `/search?query=&qf=TYPE:IMAGE`
