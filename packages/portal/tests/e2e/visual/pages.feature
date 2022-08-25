Feature: pages

  Scenario: Take a snapshot of an item page

    When I open a `item page`
    Then I see the `item page`
    And I make a snapshot of the `item page`

  Scenario: Take a snapshot of a gallery page

    When I open a `gallery page`
    Then I see a `page title`
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

  Scenario: Take a snapshot of a user's gallery/set page

    When I open a `user gallery page`
    Then I see a `user gallery page`
    And I make a snapshot of the `user gallery page`
