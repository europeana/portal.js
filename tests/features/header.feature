Feature: Page Header

  Scenario: Seeing the header everywhere

    When I open the `home page`
    Then I see the `header`
    And I see the `header` `logo`
    And I see the `header` `search box`

    When I open the `search page`
    Then I see the `header`
    And I see the `header` `logo`
    And I see the `header` `search box`

    When I open a `record page`
    Then I see the `header`
    And I see the `header` `logo`
    And I see the `header` `search box`
