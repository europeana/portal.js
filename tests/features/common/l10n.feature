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

  Scenario: Supported language choice stored in cookie
    When I open `/de`
    And I open `/about-us`
    Then I should be on `/de/about-us`

  Scenario: Unsupported language choice not stored in cookie
    When I open `/ja`
    And I open `/about-us`
    Then I should be on `/en/about-us`

  Scenario: Unsupported language is removed
    When I open `/ru/about-us`
    Then I should be on `/en/about-us`
  
  Scenario: Correct HREFLANG tags are shown
    When I open `/en`
    Then I should see alternate-hreflang tags
