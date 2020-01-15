Feature: Record rights statements

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/licenses/by-nc-nd/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-NC-ND"
