Feature: Memory budget
  Scenario: 50 MB
    Given I am on the `home page`
    Then the memory used is less than 50 MB
