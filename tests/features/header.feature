Feature: Page Header

  Scenario: Seeing the header everywhere

    When I open the `home page`
    Then I see the `header`
    And I see the `logo` in the `header`
    And I see the `search box` in the `header`

    When I open the `search page`
    Then I see the `header`
    And I see the `logo` in the `header`
    And I see the `search box` in the `header`

    When I open a `record page`
    Then I see the `header`
    And I see the `logo` in the `header`
    And I see the `search box` in the `header`
