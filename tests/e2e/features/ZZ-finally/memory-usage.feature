Feature: Memory budget
  Scenario: 85 MB
    Given I am on the `home page`
    # Wait a bit to allow garbage collection, to prevent false positives for memory leaks
    And I wait 5 seconds
    Then the memory used is less than 85 MB
