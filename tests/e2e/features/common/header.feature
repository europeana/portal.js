Feature: Page Header

  Scenario: Seeing the header at the top of all pages

    When I open the `home page`
    Then I see the `logo` in the `header`
    And I see the `show search button` in the `header`

    When I open the `search page`
    Then I see the `logo` in the `header`
    And I see the `show search button` in the `header`

    When I open an `item page`
    Then I see the `logo` in the `header`
    And I see the `show search button` in the `header`

    When I open an `entity page`
    Then I see the `logo` in the `header`
    And I see the `show search button` in the `header`

  Scenario: Using the logo to get back to the homepage

    When I open an `item page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

    When I open the `search page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

    When I open the `home page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

    When I open the `entity page`
    And I click on the `logo` in the `header`
    Then I should be on the `home page`

  Scenario: Using the hamburger button to see all menu items

    When I open the `home page`
    And I see the `hamburger button` in the `header`
    And I click on the `hamburger button` in the `header`
    Then I see a link to "/en" in the `sidebar navigation`
    And I see a link to "/en/collections" in the `sidebar navigation`
    And I see a link to "/en/share-your-collections" in the `sidebar navigation`
    And I see a link to "/en/europeana-classroom" in the `sidebar navigation`
    And I see a link to "/en/about-us" in the `sidebar navigation`
    And I see a link to "/en/help" in the `sidebar navigation`
