Feature: API requests

  Scenario: Seeing the API requests in the modal
    Given I am on the `debug page`
    And I switch the `API requests switch` on
    When I follow the "/en/collections" link
    And I click the `API requests modal button`
    Then I see the `API requests modal`
    And I should see 1 `logged API request`
    And I should have a Europeana branded page title
