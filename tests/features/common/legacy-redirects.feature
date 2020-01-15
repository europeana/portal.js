Feature: Legacy redirects

  Scenario: Remove /portal prefix
    When I open `/portal/en/about-us`
    Then I should be on `/en/about-us`

  Scenario: Remove record page .html suffix
    When I open `/de/record/90402/SK_A_2344.html`
    Then I should be on `/de/record/90402/SK_A_2344`

  Scenario: Redirect legacy agent entity URLs
    When I open `/fr/explore/people/60404-johannes-vermeer.html`
    Then I should be on `/fr/entity/person/60404-johannes-vermeer`

  Scenario: Redirect legacy topic entity URLs
    When I open `/nl/explore/topics/47-painting.html`
    Then I should be on `/nl/entity/topic/47-painting`
