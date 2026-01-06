Feature: Language selector

Scenario: Cookie notice has been dismissed
  Given I am on the `English home page`
  And there is no `cookie disclaimer`
  And I see the `language selector`
  When I click the `language selector`
  And I see a `Svenska language option` in the `language selector`
  And I click the `Svenska language option`
  Then I should be on the `Swedish home page`
  And I click the `show search button`
  And I see the text "Sök bland 60+ miljoner objekt" in the `search box` placeholder
