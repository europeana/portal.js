Feature: Record rights statements

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/publicdomain/mark/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "Public Domain"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://creativecommons.org/publicdomain/zero/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC0"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/licenses/by/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/licenses/by-sa/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-SA"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://creativecommons.org/licenses/by-nc/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-NC"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/licenses/by-nc-sa/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-NC-SA"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"https://creativecommons.org/licenses/by-nc-nd/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-NC-ND"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://creativecommons.org/licenses/by-nd/4.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "CC BY-ND"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://rightsstatements.org/vocab/NoC-NC/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "No Copyright - Non-Commercial Use Only"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://rightsstatements.org/vocab/InC-EDU/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "In Copyright - Educational Use Permitted"

  Scenario:
    Given I am on the `home page`
    When I search for "RIGHTS:\"http://rightsstatements.org/vocab/NoC-OKLR/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "No Copyright - Other Known Legal Restrictions"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://rightsstatements.org/vocab/InC/1.0/\" NOT provider_aggregation_edm_hasView:*"
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "In Copyright"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://rightsstatements.org/vocab/InC-OW-EU/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "In Copyright - EU Orphan Work"
  
  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://rightsstatements.org/vocab/CNE/1.0/\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "Copyright Not Evaluated"

  Scenario:
    Given I am on the `home page`
    When I search for "wr_edm_rights:\"http://www.europeana.eu/rights/rr-f\""
    And I click a `search result`
    And I see a `record page`
    Then I see a `rights statement` with the text "Rights Reserved - Free Access"
