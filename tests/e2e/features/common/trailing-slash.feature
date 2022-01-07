Feature: Removal of trailing slashes from URLs

  Scenario: Home page
    When I open `/en/`
    Then I should be on `/en`

  Scenario: Collections hub page
    When I open `/en/collections/`
    Then I should be on `/en/collections`
