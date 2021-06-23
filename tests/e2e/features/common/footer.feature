Feature: Page Footer

  Scenario: Seeing the footer at the bottom of all pages

    When I open the `home page`
    Then I see the `footer`

    When I open the `search page`
    Then I see the `footer`

    When I open an `item page`
    Then I see the `footer`

    When I open an `entity page`
    Then I see the `footer`

  # While the site is in demo use, most footer links will be disabled.
  # TODO: Uncomment the relevant links when they become available again.
  # Scenario: Seeing the relevant links in the footer

    When I open the `home page`
    Then I see the `footer`
    And I see a link to "/en/rights" in the `footer`
    And I see a link to "https://pro.europeana.eu/our-mission/office-employees" in the `footer`
    And I see a link to "/en/for-developers" in the `footer`
    And I see a link to "https://pro.europeana.eu/services/data-publication-services" in the `footer`
    And I see a link to "/en/help" in the `footer`
    And I see a link to "/en/rights" in the `footer`
