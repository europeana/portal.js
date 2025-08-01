Feature: Newspapers collection

  Scenario: Filtering results using the date filter
    Given I am on the `Newspapers theme search page`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `proxy_dcterms_issued apply button`
    Then I should be on `/en/search?page=1&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D`
