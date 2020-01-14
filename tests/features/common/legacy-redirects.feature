Feature: Legacy redirects

  Scenario: Remove /portal prefix
    When I open `/portal/en/about-us`
    Then I should be on `/en/about-us`

  Scenario: Remove record page .html suffix
    When I open `/de/record/90402/SK_A_2344.html`
    Then I should be on `/de/record/90402/SK_A_2344`
