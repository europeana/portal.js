Feature: Debug page

  @debug-apirequests-not-enabled
  Scenario: Debug menu disabled by default
    Given I am on the `debug page`
    Then I don't have a `debug link group` in the `footer`
    And I should have a Europeana branded page title

  Scenario: Enabling the debug menu with the API requests switch
    Given I am on the `debug page`
    When I switch the `enable debug menu switch` on
    And I click the `save debug settings button`
    Then I see a `debug link group` in the `footer`

  Scenario: Disabling the debug menu with the API requests switch
    Given I am on the `debug page`
    And I switch the `enable debug menu switch` on
    And I click the `save debug settings button`
    And I see a `debug link group` in the `footer`
    When I visit the `debug page`
    And I switch the `enable debug menu switch` off
    And I click the `save debug settings button`
    Then I don't have a `debug link group` in the `footer`

  Scenario: Debug menu shows on all pages
    Given I am on the `debug page`
    And I switch the `enable debug menu switch` on
    And I click the `save debug settings button`
    When I visit the `about page`
    Then I see a `debug link group` in the `footer`

  Scenario: Debug settings are persisted
    Given I am on the `debug page`
    And I switch the `enable debug menu switch` on
    And I click the `save debug settings button`
    When I visit the `about page`
    And I visit the `debug page`
    Then the `enable debug menu switch` is switched on
