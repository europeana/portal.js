Feature: User Set Page

  Scenario: Viewing a public set

    When I open a `user gallery page`
    Then I see the `user gallery page`
    And I see an `item count`
    And I see an `item previews grid`
    And I see an `item preview`
    And I am on an accessible page
