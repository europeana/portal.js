Feature: Topics listing page

  Scenario: View an index of topics

    Given I am on the `topics listing page`
    Then I should see 24 `content card`s
    And I see a `pagination navigation`
    And I am on an accessible page

  Scenario: Open a topic

    When I open the `topics listing page`
    Then I see a `content card` in the `topics listing page`
    And I click a `content card`
    And I wait for the page to load
    Then I should not be on the `topics listing page`