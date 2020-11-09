Feature: User Set Page

  Scenario: Viewing a public set

    When I open an `user gallery page`
    Then I see the `user gallery page`
    And I see a `item count`
    And I see a `item previews grid`
    And I see a `item preview`
    And I am on an accessible page
