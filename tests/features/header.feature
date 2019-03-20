Feature: Page Header

  Scenario: Seeing the header everywhere

    When I open the `home page`
    Then I see the `logo` in the `header`
    And I see the `search box` in the `header`

    When I open the `search page`
    Then I see the `logo` in the `header`
    And I see the `search box` in the `header`

    When I open a `record page`
    Then I see the `logo` in the `header`
    And I see the `search box` in the `header`

  Scenario: Using the logo to get back to the homepage

    When I open a `record page`
    And I click on the  `logo` in the `header`
    Then I should be on the `home page`

    When I open the `search page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

    When I open the `home page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`
