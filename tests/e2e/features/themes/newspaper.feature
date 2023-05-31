Feature: Newspapers collection

  Scenario: Filtering results using the date filter
    Given I am on the `Newspapers theme search page`
    And I enter "18-05-1982" in the `date range start input`
    And I enter "18-05-2004" in the `date range end input`
    And I click the `proxy_dcterms_issued apply button`
    Then I should be on `/en/search?page=1&qf=collection%3Anewspaper&qf=proxy_dcterms_issued%3A%5B1982-05-18%20TO%202004-05-18%5D&api=fulltext`

  Scenario: Newspapers collection API toggle defaults to fulltext
    Given I am on the `Newspapers theme search page`
    Then the "fulltext" api checkbox is checked

  Scenario: Fulltext search shows hit highlights
    Given I am on the `Newspapers theme search page`
    And I click the `search list view toggle icon`
    When I click the `show search button`
    And I enter "zeitung" in the `search box`
    And I press the ENTER key
    Then I see a `highlighted search term` with the text "Zeitung"

  Scenario: Newspapers collection API toggle changes API
    Given I am on `/en/search?qf=collection%3Anewspaper&view=grid`
    And I click the `api switch filter`
    Then I should be on `/en/search?page=1&qf=collection%3Anewspaper&view=grid&api=metadata`

  Scenario: Newspapers collection API toggle is removed when switching collection
    Given I am on `/en/search?page=1&qf=collection%3Anewspaper&api=metadata`
    When I click the `collection side facet dropdown button`
    And I click the `sport collection field`
    Then I should be on `/en/search?page=1&qf=collection%3Asport`

  Scenario: Newspapers collection API toggle is removed by reset button
    Given I am on `/en/search?page=1&qf=collection%3Anewspaper&api=metadata`
    And the `reset filters button` is "enabled"
    When I click the `reset filters button`
    Then I should be on `/en/search?page=1`

  Scenario: Newspapers collection API toggle is not removed when switching pages
    Given I am on the `Newspapers theme search page`
    And I click the `api switch filter`
    And I should be on `/en/search?page=1&qf=collection%3Anewspaper&api=metadata`
    And I go to page number 2
    Then I should be on `/en/search?page=2&qf=collection%3Anewspaper&api=metadata`

  Scenario: Newspapers collection API toggle is removed by searching in the entire collection
    Given I am on `/en/search?qf=collection%3Anewspaper&api=fulltext`
    When I click the `show search button`
    When I enter "paris" in the `search box`
    And I click the `search entire collection button`
    Then I see the `search page`
    And I should be on `/en/search?query=paris&view=grid`

  # TODO: re-implement this version and remove the feature above after advanced search is active
  # Scenario: Newspapers collection API toggle is preserved when searching
  #   Given I am on `/en/search?qf=collection%3Anewspaper&api=fulltext`
  #   When I click the `show search button`
  #   When I enter "paris" in the `search box`
  #   And I click the `search entire collection button`
  #   Then I see the `search page`
  #   And I should be on `/en/search?view=grid&query=paris&qf=collection%3Anewspaper&api=fulltext`
