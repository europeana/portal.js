Feature: Home page
  As a user I want to be presented with an entry point to
  the rest of the portal when I visit the base URL. This means
  a curated page is available at the "http(s)://[domain]/" URL.
  This page should allow preview functionality.

  Scenario: Viewing the homepage
    The homepage is a browse page from Contentful

    When I open `/en`
    Then I see a `browse page`
    And I am on an accessible page
    And I should have a Europeana branded page title
    And I do not see the Klaro banner

  Scenario: Seeing a notification banner

    When I open `/en`
    Then I see a `notification banner`

  @klaro-notice-not-dismissed
  Scenario: Seeing the cookie disclaimer on first visit

    When I open `/en`
    And I see the Klaro banner
    And I accept all Klaro cookies
    And I do not see the Klaro banner
    And I open `/en`
    Then I do not see the Klaro banner
