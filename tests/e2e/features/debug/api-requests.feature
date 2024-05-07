Feature: API requests

  Scenario: Seeing the API requests in the modal
    When I visit the `search page`
    When I click the `API requests link`
    Then I see the `API requests modal`
    And I should see 1 `logged API request`
