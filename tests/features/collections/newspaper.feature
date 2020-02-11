Feature: Newspapers collection

  Scenario: Filtering results using the date filter in more facets dropdown
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/entity/topic/18-newspaper?page=1&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D&view=grid&api=fulltext`

  Scenario: Newspapers collection API toggle defaults to fulltext
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    Then the "fulltext" "api" radio is checked

  Scenario: Newspapers collection API toggle changes API
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I click the "metadata" "api" radio
    And I click the `apply button`
    And I wait 2 seconds
    Then I should be on `/en/entity/topic/18-newspaper?page=1&view=grid&api=metadata`

  Scenario: Newspapers collection API toggle is removed when switching collection
    Given I am on `/en/search?page=1&query=&view=grid&qf=collection:newspaper&api=fulltext`
    When I click the `collection dropdown button`
    And I check the "music" "collection" radio
    And I click the `collection apply button`
    And I wait 3 seconds
    Then I should be on `/en/search?page=1&qf=collection%3Amusic&query=&view=grid`

  Scenario: Newspapers collection API toggle is removed by reset button
    Given I am on `/en/search?page=1&query=&view=grid&qf=collection:newspaper&api=fulltext`
    When I click the `reset filters button`
    And I wait 3 seconds
    Then I should be on `/en/search?page=1&query=&view=grid`

  Scenario: Newspapers collection API toggle is not removed when switching pages
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I click the "metadata" "api" radio
    And I click the `apply button`
    And I wait 2 seconds
    And I go to page number 2
    And I wait 2 seconds
    Then I should be on `/en/entity/topic/18-newspaper?page=2&view=grid&api=metadata`
