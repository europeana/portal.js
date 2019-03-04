Feature: Page Header

  Scenario: Seeing the header everywhere

    Given I open the `home page`
    Then I see the `header`
    And I see the `header` `logo`
    And I see the `header` `search box`

    Given I open the `search page`
    Then I see the `header`
    And I see the `header` `logo`
    And I see the `header` `search box`
