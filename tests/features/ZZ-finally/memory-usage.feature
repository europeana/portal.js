Feature: Memory budget
  Scenario: 75 MB
    Given I am on the `home page`
    Then the memory used is less than 75 MB
