Feature: Page layout on all pages.
  In order to access the content of the website in
  an accessible, clear and enticing manner
  I want to be presented with an accessible and styled
  layout for all pages.

@klaro-notice-not-dismissed
  Scenario: Moving to the main content using the skip-to-main functionality
    When I visit the `home page`
    And I see the Klaro banner
    And I accept all Klaro cookies
    And I press the TAB key
    And I see the `main content accessibility link`
    And I press the ENTER key
    Then I should be on `/en#main`

  Scenario: Main navigation is visible
    When I open the `home page`
    Then I see the `top navigation`

  Scenario: An aria-live region exists to announce route changes
    When I visit the `home page`
    Then I find the `vue announcer`

  Scenario: After a route change the keyboard focus is at the top of the page
    Given I am on the `search page`
    And I see an `item preview`
    When I click an `item preview`
    Then I see an `item page`
    Then The `top page` is active
    And I press the TAB key
    Then I see the `main content accessibility link`
