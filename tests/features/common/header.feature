Feature: Page Header

  Scenario: Seeing the header at the top of all pages
    
    When I open the `home page`
    Then I see the `logo` in the `header`
    And I see the `search button` in the `header`

    When I open the `search page`
    Then I see the `logo` in the `header`
    And I see the `search button` in the `header`

    When I open an `item page`
    Then I see the `logo` in the `header`
    And I see the `search button` in the `header`

    When I open an `entity page`
    Then I see the `logo` in the `header`
    And I see the `search button` in the `header`

  Scenario: Using the logo to get back to the homepage

    When I open an `item page`
    And I click on the `logo` in the `header`
    And I wait for the page to load
    Then I should be on the `home page`

    When I open the `search page`
    And I click on the `logo` in the `header`
    And I wait for the page to load
    Then I should be on the `home page`

    When I open the `home page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

    When I open the `entity page`
    And I click on the `logo` in the `header`
    And I wait for the page to load
    Then I should be on the `home page`
