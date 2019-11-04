Feature: Record page

  Scenario: View any existing record page

    When I open a `record page`
    Then I see the `record page`
    And I see a `metadata field`
    And I see a `metadata field` in the `web resource`
    And I am on an accessible page

  Scenario: Attempting to view a record page which doesn't exist

    When I open `/en/record/123456/THIS_IDENTIFIER_DOES_NOT_EXIST`
    Then I see an `error notice`
    And I am on an accessible page

  Scenario: Action bar

    When I open a `record page`
    Then I see an `action bar`
    And I see a `download button`
