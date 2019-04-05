Feature: Accessibility

  Scenario: Browse page

    When I open the `home page`
    Then I am on an accessible page

  Scenario: Record page

    When I open a `record page`
    Then I am on an accessible page

  Scenario: Search page
    When I visit a `search page`
    Then I am on an accessible page

  Scenario: Search results page

    When I visit a `search page`
    And I click the `search button`
    And I wait 2 seconds
    Then I am on an accessible page

  Scenario: Search page with facets applied
    When I visit `/search?query=&page=1&reusability=open&qf=TYPE%3A%22IMAGE%22&qf=COUNTRY%3A%22Belgium%22`
    And I wait 2 seconds
    Then I am on an accessible page
