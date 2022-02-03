Feature: Fashion collection

  Scenario: CREATOR facet in more filters
    Given I am on the `Fashion collection search page`
    Then I see the `CREATOR facet dropdown`
    And I see the `proxy_dc_format.en facet dropdown`
    # TODO: proxy_dcterms_medium should be displayed twice, once as colour and once as material
    And I see the `proxy_dcterms_medium.en facet dropdown`
    And I see the `proxy_dc_type.en facet dropdown`
