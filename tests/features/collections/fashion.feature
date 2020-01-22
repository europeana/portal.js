Feature: Fashion collection

  Scenario: CREATOR facet in more filters
    Given I am on the `Fashion collection search page`
    When I click the `more filters dropdown button`
    Then I see the `CREATOR facet`
    And I see the `proxy_dc_format.en facet`
    # TODO: proxy_dcterms_medium should be displayed twice, once as colour and once as material
    And I see the `proxy_dcterms_medium.en facet`
    And I see the `proxy_dc_type.en facet`
