Feature: Pages

  Scenario: Item page
    When I open an `item page with IIIF annotations`
    Then I see the `item page`
    And I wait 5 seconds
    And I make a snapshot of the `item page with IIIF annotations`

  Scenario: Gallery page
    When I open a `gallery page`
    Then I see an `item previews grid`
    And I wait 2 second
    And I make a snapshot of the `gallery page`

  Scenario: Exhibition landing page
    When I open the `exhibition page`
    Then I see `exhibition text`
    And I make a snapshot of the `exhibition page`

  Scenario: Exhibition chapter page
    When I open the `exhibition fashion chapter`
    Then I see an `exhibition chapter`
    And I make a snapshot of the `exhibition fashion chapter`

  Scenario: Static page
    When I open a `static page`
    Then I see a `static page`
    And I make a snapshot of the `static page`
  
  Scenario: APIs landing page
    When I open a `APIs landing page`
    Then I see a `landing page`
    And I make a snapshot of the `APIs landing page`

  Scenario: Share your collections landing page
    When I open the `share your collections landing page`
    Then I see a `landing page`
    And I make a snapshot of the `share your collections landing page`
