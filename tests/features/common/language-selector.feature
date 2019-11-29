Feature: Select language

Scenario: Change language
  Given I am on the `English home page`
  And I accept cookies
  When I click the `language selector`
  And I see a `Svenska language option` in the `language selector`
  And I click the `Svenska language option`
  And I wait 2 seconds
  Then I should be on the `Swedish home page`
  And I see the text "Vad letar du efter?" in the `search box` placeholder
