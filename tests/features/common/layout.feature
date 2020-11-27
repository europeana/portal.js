Feature: Page layout on all pages.
  In order to access the content of the website in
  an accessible, clear and enticing manner
  I want to be presented with an accessible and styled
  layout for all pages.

  @cookie-notice-not-dismissed
  Scenario: Moving to the main content using the skip-to-main functionality
    When I visit an `item page`
    And I see a `cookie disclaimer`
    And I accept cookies
    And I wait 1 second
    And I press the TAB key
    And I see the `main content accessibility link`
    And I press the ENTER key
    Then I should be on `/en/item/09102/_GNM_693983#main`

  Scenario: Main navigation is visible
    When I open the `home page`
    Then I see the `desktop navigation`
