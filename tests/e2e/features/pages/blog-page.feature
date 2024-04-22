Feature: Blog page

  Scenario: Blog Sections & Cards
    When I open the `blog page`
    Then I see a `content card` in the `hub page card group`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Blog post not found
    When I open `/blog/404-not-found`
    Then I should be on `/en/blog`
