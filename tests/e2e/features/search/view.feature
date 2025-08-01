Feature: View styles (List and Grid)
  In order to gain a better overview of different types of europeana items,
  as a user I want to be able to switch between a list and grid view style when
  on search results pages.

  # TODO: Add back - And I click the `search button` instead of press ENTER

  Scenario: Defaulting to grid view
    When I visit the `search page`
    Then I see a `item previews grid`

  Scenario: Defaulting to grid view after paginating
    When I visit the `search page`
    And I go to page number 2
    Then I see a `item previews grid`

  Scenario: Switching to the list view
    When I visit the `search page`
    And I click the `view toggle`
    And I click the `list view option`
    Then I see a `item previews list`
    And I am on an accessible page

  Scenario: Switching to the mosaic view
    When I open `/search?view=grid`
    And I click the `view toggle`
    And I click the `mosaic view option`
    And I wait for the `item previews mosaic`
    Then I see a `item previews mosaic`
    And I am on an accessible page

  Scenario: Switching to the grid view
    When I open `/search?view=list`
    And I click the `view toggle`
    And I click the `grid view option`
    Then I see a `item previews grid`
    And I am on an accessible page

  Scenario: Switching to the list view and paginating
    When I visit the `search page`
    And I click the `view toggle`
    And I click the `list view option`
    And I go to page number 2
    Then I see a `item previews list`

  Scenario: Switching to the mosaic view and paginating
    When I open `/search?view=grid`
    And I click the `view toggle`
    And I click the `mosaic view option`
    And I wait for the `item previews mosaic`
    And I go to page number 2
    Then I see a `item previews mosaic`

  # FIXME: this fails since dependent on Nightwatch setCookie
  # Scenario: The view parameter is preserved and present in the URL for the list view
  #   Given I have chosen the `list` search results view
  #   When I visit the `home page`
  #   And I click the `show search button`
  #   And I enter "paris" in the `search box`
  #   And I press the ENTER key
  #   Then I see a `item previews list`

  # FIXME: this does not test anything useful given that grid is the default view
  # Scenario: The view parameter is preserved and present in the URL for the grid view
  #   Given I have chosen the `grid` search results view
  #   When I visit the `home page`
  #   And I click the `show search button`
  #   And I enter "paris" in the `search box`
  #   And I press the ENTER key
  #   Then I see a `item previews grid`

  # FIXME: this fails since dependent on Nightwatch setCookie
  # Scenario: The view parameter is preserved and present in the URL for the mosaic view
  #   Given I have chosen the `mosaic` search results view
  #   When I visit the `home page`
  #   And I click the `show search button`
  #   And I enter "paris" in the `search box`
  #   And I press the ENTER key
  #   Then I see a `item previews mosaic`

  Scenario: Back button restores previous view
    Given I am on `/search?view=grid`
    And I click the `view toggle`
    When I click the `list view option`
    And I see a `item previews list`
    And I go back
    Then I see a `item previews grid`
