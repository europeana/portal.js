Feature: Fashion collection

  Scenario: CREATOR facet
    Given I am on the `Fashion theme search page`
    Then I see the `CREATOR side facet dropdown button`
    And I see the `proxy_dc_format.en side facet dropdown button`
    # TODO: proxy_dcterms_medium should be displayed twice, once as colour and once as material
    And I see the `proxy_dcterms_medium.en side facet dropdown button`
    And I see the `proxy_dc_type.en side facet dropdown button`
