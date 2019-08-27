Feature: Home page
  As a user I want to be presented with an entry point to
  the rest of the portal when I visit the base URL. This means
  a curated page is available at the "http(s)://[domain]/" URL.
  This page should allow preview functionality.

  Scenario: Previewing the homepage
    Contentful will link to "//?mode=preview" as the slug for the homepage there is simply '/'

    When I open `//?mode=preview`
    Then I should be on `/?mode=preview`
    And I am on an accessible page
