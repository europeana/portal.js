Feature: Data Space page

  Scenario: Viewing the Data Space page

    When I open the `data space page`
    Then I see a `landing page`
    And I am on an accessible page
    And I should not have a Europeana branded page title
