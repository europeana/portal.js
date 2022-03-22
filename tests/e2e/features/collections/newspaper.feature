Feature: Newspapers collection

  Scenario: Filtering results using the date filter
    Given I am on the `Newspapers collection page`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `proxy_dcterms_issued apply button`
    Then I should be on `/en/collections/topic/18-newspapers?page=1&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D&api=fulltext`

  Scenario: Newspapers collection API toggle defaults to fulltext
    Given I am on the `Newspapers collection page`
    Then the "fulltext" api checkbox is checked

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
    And I click the `api switch filter`
    Then I should be on `/en/collections/topic/18-newspapers?page=1&view=grid&api=metadata`

  Scenario: Newspapers collection API toggle is removed when switching collection
    Given I am on `/en/search?page=1&qf=collection%3Anewspaper&api=metadata`
    And the `collection side facet dropdown button` has an enabled button
    When I click the `collection side facet dropdown button`
    And I click the `sport collection field`
    Then I should be on `/en/search?page=1&qf=collection%3Asport`

  Scenario: Newspapers collection API toggle is removed by reset button
    Given I am on `/en/search?page=1&qf=collection%3Anewspaper&api=metadata`
    And the `reset filters button` is "enabled"
    When I click the `reset filters button`
    Then I should be on `/en/search?page=1`

  Scenario: Newspapers collection API toggle is not removed when switching pages
    Given I am on the `Newspapers collection page`
    And I click the `api switch filter`
    And I should be on `/en/collections/topic/18-newspapers?page=1&api=metadata`
    And I go to page number 2
    Then I should be on `/en/collections/topic/18-newspapers?page=2&api=metadata`

Scenario: Newspapers collection API toggle is removed by searching in the entire collection
    Given I am on `/en/collections/topic/18-newspapers?api=fulltext`
    When I click the `show search button`
    When I enter "paris" in the `search box`
    And I click the `search entire collection button`
    Then I see the `search page`
    And I should be on `/en/search?view=grid&query=paris`
