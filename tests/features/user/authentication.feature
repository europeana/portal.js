Feature: Authentication
# This file contains tests for various actions around logging in/out.
# Since this requires credentials which it does not makes sense to share as defaults,
# the tests relying on these are commented out. Fake credentials are currently in docker/stack/docker-compose.yml

  Scenario: Not being Authenticated
    Given I visit the `sign out page`
    When I am on the `home page`
    Then I see the `log in button`

  Scenario: Visiting my account without being authenticated
    Given I visit the `sign out page`
    When I visit the `account page`
    Then I should not be on the `account page`

#  Scenario: Logging in
#    Given I am on the `home page`
#    When I click the `log in button`
#    And I submit my europeana auth credentials
#    Then I should be on the `account page`
#    And I don't have a `hamburger button` in the `header`
#    And I see the `account button`
#    And I don't have a `log in button`
#
#  @logged-in
#  Scenario: Visiting my account
#    Given I am on the `home page`
#    When I click the `account button`
#    And I click the `likes and galleries button`
#    Then I should be on the `account page`
#    And I see the 'account button`
#
#  @logged-in
#  Scenario: logging out
#    Given I am on the `home page`
#    When I click the `account button`
#    And I click the `log out button`
#    Then I should be on the `home page`
#    And I see the 'log in button`
