Feature: Static page

  Scenario: Static page sections

    When I open a `static page`
    Then I see a `static page`
    And I see `markdown` in the `authored section`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Static page linklist

    When I open a `static page with linklist`
    Then I see a `static page`
    And I see a `link list`
