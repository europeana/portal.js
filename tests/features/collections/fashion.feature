Feature: Fashion collection

  Scenario: CREATOR facet in more filters
    Given I am on the `Fashion collection search page`
    When I click the `more filters dropdown button`
    Then I see the `CREATOR facet`
