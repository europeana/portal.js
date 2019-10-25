Feature: Item page

  Scenario: View any existing item page

    When I open a `item page`
    Then I see the `item page`
    And I see a `metadata field`
    And I see a `metadata field` in the `web resource`
    And I am on an accessible page

  Scenario: Attempting to view a item page which doesn't exist

    When I open `/en/item/123456/THIS_IDENTIFIER_DOES_NOT_EXIST`
    Then I see an `error notice`
    And I am on an accessible page
