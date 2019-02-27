Feature: Page Header

  Scenario: Seeing the header everywhere

    Given I open the `home page`
    Then I see the `header`
    And I see an `header logo`
    And I see an `search box`

    Given I open the `search page`
    Then I see the `header`
    And I see an `header logo`
    And I see an `search box`
