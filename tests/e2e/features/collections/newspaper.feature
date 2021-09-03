Feature: Newspapers collection

  Scenario: Filtering results using the date filter in more facets dropdown
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `apply button`
    Then I should be on `/en/collections/topic/18-newspapers?page=1&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D&view=grid&api=fulltext`

  Scenario: Newspapers collection API toggle defaults to fulltext
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    Then the "fulltext" "api" radio is checked

  Scenario: Fulltext search shows hit highlights
    Given I am on the `Newspapers collection page`
    And I click the `search list view toggle`
    When I click the `show search button`
    And I enter "zeitung" in the `search box`
    And I press the ENTER key
    Then I see a `highlighted search term` with the text "Zeitung"

  Scenario: Newspapers collection API toggle changes API
    Given I am on the `Newspapers collection page`
    And I click the `search grid view toggle`
    When I click the `more filters dropdown button`
    And I click the "metadata" "api" radio
    And I click the `apply button`
    Then I should be on `/en/collections/topic/18-newspapers?page=1&view=grid&api=metadata`

  Scenario: Newspapers collection API toggle is removed when switching collection
    Given I am on `/en/search?page=1&view=grid&qf=collection%3Anewspaper&api=fulltext`
    When I click the `collection dropdown button`
    And I check the "sport" "collection" radio
    And I click the `collection apply button`
    Then I should be on `/en/search?page=1&qf=collection%3Asport&view=grid`

  Scenario: Newspapers collection API toggle is removed by reset button
    Given I am on `/en/search?page=1&view=grid&qf=collection%3Anewspaper&api=fulltext`
    When I click the `reset filters button`
    Then I should be on `/en/search?page=1&view=grid`

  Scenario: Newspapers collection API toggle is not removed when switching pages
    Given I am on the `Newspapers collection page`
    When I click the `more filters dropdown button`
    And I click the "metadata" "api" radio
    And I click the `apply button`
    And I should be on `/en/collections/topic/18-newspapers?page=1&view=grid&api=metadata`
    And I go to page number 2
    Then I should be on `/en/collections/topic/18-newspapers?page=2&view=grid&api=metadata`

Scenario: Newspapers collection API toggle is removed by searching in the entire collection
    Given I am on `/en/collections/topic/18-newspapers?api=fulltext&view=grid`
    When I click the `show search button`
    When I enter "paris" in the `search box`
    And I click the `search entire collection button`
    Then I see the `search page`
    And I should be on `/en/search?view=grid&query=paris`
