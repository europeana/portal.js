Feature: Localisation

  Scenario: Redirect URLs without locale to those with
    When I open `/about-us`
    Then I should be on `/en/about-us`

  @non-default-browser
  Scenario: Browser accepts supported, non-default language
    Given my browser accepts the language "nl"
    When I open `/about-us`
    Then I should be on `/nl/about-us`

  @non-default-browser
  Scenario: Browser accepts unsupported, non-default language
    Given my browser accepts the language "ja"
    When I open `/about-us`
    Then I should be on `/en/about-us`

  Scenario: Language preference stored in cookie
    When I open `/de`
    And I open `/about-us`
    Then I should be on `/de/about-us`
