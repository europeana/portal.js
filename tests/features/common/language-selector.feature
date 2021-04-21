Feature: Language selector

Scenario: Cookie notice has been dismissed
  Given I am on the `English home page`
  And I see the `language selector`
  When I click the `language selector`
  And I see a `Svenska language option` in the `language selector`
  And I click the `Svenska language option`
  Then I should be on the `Swedish home page`
  And I click the `show search button`
  And I see the text "Vad letar du efter?" in the `search box` placeholder

@cookie-notice-not-dismissed
Scenario: Cookie notice has not been dismissed
  Given I am on the `English home page`
  And I see the `language selector`
  When I click the `language selector`
  And I see a `Svenska language option` in the `language selector`
  And I click the `Svenska language option`
  Then I should be on the `Swedish home page`
  And I click the `show search button`
  And I see the text "Vad letar du efter?" in the `search box` placeholder
