Feature: pages

  @non-default-browser
  Scenario: Take a snapshot of an item page

    Given my browser accepts the language "en"
    When I open a `item page`
    Then I see the `item page`
    And I make a snapshot of the `item page`
    And I see the `item page`

  @non-default-browser
  Scenario: Take a snapshot of a gallery page

    Given my browser accepts the language "en"
    When I open a `gallery page`
    Then I see a `page title`
    And I make a snapshot of the `gallery page`
    And I see a `page title`

  @non-default-browser
  Scenario: Take a snapshot of an exhibition landing page

    Given my browser accepts the language "en"
    When I open the `exhibition page`
    Then I see `exhibition text`
    And I make a snapshot of the `exhibition page`
    And I see `exhibition text`

  @non-default-browser
  Scenario: Take a snapshot of an exhibition chapter page

    Given my browser accepts the language "en"
    When I open the `exhibition chapter`
    Then I see an `exhibition chapter`
    And I make a snapshot of the `exhibition chapter`
    And I see an `exhibition chapter`

  @non-default-browser
  Scenario: Take a snapshot of a static page

    Given my browser accepts the language "en"
    When I open a `static page`
    Then I see a `static page`
    And I make a snapshot of the `static page`
    And I see a `static page`

  @non-default-browser
  Scenario: Take a snapshot of a user's gallery/set page

    Given my browser accepts the language "en"
    When I open a `user gallery page`
    Then I see a `user gallery page`
    And I make a snapshot of the `user gallery page`
    And I see a `user gallery page`
