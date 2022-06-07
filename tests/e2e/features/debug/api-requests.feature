Feature: API requests

  Scenario: Seeing the API requests in the modal
    Given I am on the `debug page`
    And I switch the `enable debug menu switch` on
    And I click the `save debug settings button`
    When I visit the `search page`
    When I click the `API requests link`
    Then I see the `API requests modal`
    And I should see 1 `logged API request`
