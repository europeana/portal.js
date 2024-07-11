Feature: Stories page

  Scenario: Stories Sections & Cards
    When I open the `stories page`
    Then I see a `content card` in the `stories interface`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Searching stories by tags
    When I open the `stories page`
    And I see the `stories tags dropdown` in the `stories interface`
    And I click the `tags dropdown search input`
    Then I see the `tags search dropdown`
    And I enter "art" in the `tags dropdown search input`
    Then I see a `art category tag` with the text "art"
    And I press the TAB key
    And the `art category tag` is highlighted
    And I press the ENTER key
    Then I should be on `/en/stories?tags=art`

  Scenario: Filtering stories by type
    When I open the `stories page`
    And I see the `stories type filter` in the `stories interface`
    And I click the `Stories type filter`
    Then I should be on `/en/stories?type=story`
    And I click the `View all type filter`
    Then I should be on `/en/stories`
    And I click the `Exhibitions type filter`
    Then I should be on `/en/stories?type=exhibition`
    And I click the `tags dropdown search input`
    And I click the `nature category tag`
    Then I should be on `/en/stories?type=exhibition&tags=nature`
    And I click the `View all type filter`
    Then I should be on `/en/stories?tags=nature`
    And I click the `Exhibitions type filter`
    And I click the `nature category tag`
    Then I should be on `/en/stories?type=exhibition`

  Scenario: Story not found
    When I open `/stories/404-not-found`
    Then I should be on `/en/stories/404-not-found`
    And I see an `error notice`
