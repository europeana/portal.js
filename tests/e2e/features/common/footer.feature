Feature: Page Footer

  Scenario: Seeing the footer at the bottom of all pages

    When I open the `home page`
    Then I see the `footer`

    When I open the `search page`
    Then I see the `footer`

    When I open an `item page with IIIF annotations`
    Then I see the `footer`

    When I open an `entity page`
    Then I see the `footer`

  Scenario: Seeing the relevant links in the footer

    When I open the `home page`
    Then I see the `footer`
    And I see a link to "/en/about-us" in the `footer`
    And I see a link to "#api-requests" in the `footer`
    And I see a link to "https://zfrmz.eu/q6ulfDs1ONYQ0tEz0vpS" in the `footer`
    And I see a link to "/en/help" in the `footer`
    And I see a link to "/en/rights" in the `footer`
    And I see a link to "/en/rights/privacy-statement" in the `footer`
    And I see a link to "/en/rights/accessibility-policy" in the `footer`
    And I see a link to "/en/rights/cookies-policy" in the `footer`
    And I see a link to "/en/faq" in the `footer`
