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
    And I press the TAB key
    And I see the `main content accessibility link`
    And I press the ENTER key
    Then I should be on `/en/item/09102/_GNM_693983#main`

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

  Scenario: The feedback button is visible
    When I visit the `home page`
    Then I find the `feedback button`

  Scenario: Opening the feedback widget
    When I visit the `home page`
    Then I find the `feedback button`
    Then I click the `feedback button`
    And I wait 1 second
    Then I see the `feedback widget form`

  Scenario: Submitting feedback with an invalid email address
    When I visit the `home page`
    Then I click the `feedback button`
    And I wait 1 second
    And I enter "Feature testing this site is great!" in the `feedback textarea`
    And I click the `feedback next button`
    Then I enter "thisisnotanemail" in the `feedback email input`
    And I click the `feedback next button`
    Then I see `feedback email invalid`
