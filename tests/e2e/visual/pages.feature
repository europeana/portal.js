Feature: pages

  Scenario: Take a snapshot of an item page

    When I open an `item page with IIIF annotations`
    Then I see the `item page`
    And I make a snapshot of the `item page with IIIF annotations`

  Scenario: Take a snapshot of a gallery page

    When I open a `gallery page`
    Then I see an `item previews grid`
    And I wait 2 second
    And I make a snapshot of the `gallery page`

  Scenario: Take a snapshot of an exhibition landing page

    When I open the `exhibition page`
    Then I see `exhibition text`
    And I make a snapshot of the `exhibition page`

  Scenario: Take a snapshot of the fashion exhibition chapter page

    When I open the `exhibition fashion chapter`
    Then I see an `exhibition chapter`
    And I make a snapshot of the `exhibition fashion chapter`

  Scenario: Take a snapshot of a static page

    When I open a `static page`
    Then I see a `static page`
    And I make a snapshot of the `static page`
