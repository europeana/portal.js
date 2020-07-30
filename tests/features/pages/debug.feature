Feature: Debug page

  Scenario: Debug menu disabled by default
    Given I am on the `debug page`
    Then I don't have a `debug menu` in the `footer`

  Scenario: Enabling the debug menu with the API requests switch
    Given I am on the `debug page`
    When I switch the `API requests switch` on
    Then I see a `debug menu` in the `footer`

  Scenario: Disabling the debug menu with the API requests switch
    Given I am on the `debug page`
    And I switch the `API requests switch` on
    And I see a `debug menu` in the `footer`
    When I switch the `API requests switch` off
    Then I don't have a `debug menu` in the `footer`

  Scenario: Debug settings are persisted
    Given I am on the `debug page`
    And I switch the `API requests switch` on
    When I visit the `about page`
    And I visit the `debug page`
    Then the `API requests switch` is switched on
