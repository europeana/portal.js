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
  
  Scenario: Seeing the Cookie Disclaimer on first visit
    The homepage is a browse page from Contentful

    When I open `/en`
    And I see a `cookie disclaimer`
    And I click the `cookie disclaimer button`
    And I don't see the `cookie disclaimer`
    And I open `/en`
    Then I don't see the `cookie disclaimer`
