Feature: Record page

  Scenario: View any existing record page

    When I open a `record page`
    Then I see the `record page`
    And I see the `main metadata section`
    And I see a `metadata field`
    And I am on an accessible page

  Scenario: Attempting to view a record page which doesn't exist

    When I open `/en/record/123456/THIS_IDENTIFIER_DOES_NOT_EXIST`
    Then I see an `error notice`
    And I am on an accessible page

  Scenario: Action bar

    When I open a `record page`
    Then I see an `action bar`
    And I see a `download button`
    And I see a `rights statement`
    And I see a `provider name`

  Scenario: Record without isShownBy or hasView

    When I open a `record page without isShownBy or hasView`
    Then I see the `record page`
    And I see the `media preview image`

  Scenario: One related entity
    When I open `"The Milkmaid" record page`
    Then I see `related entities`
    And I see the `Painting entity card` in the `related entities`

  Scenario: Multiple related entities
    When I open the `"Het laatste avondmaal" record page`
    Then I see `related entities`
    And I see the `Leonardo da Vinci entity card` in the `related entities`
    And I see the `Teodoro Matteini entity card` in the `related entities`
    And I see the `Engraving entity card` in the `related entities`

  Scenario: Metadata in another language
    When I open the `"Hammerflügel" record page`
    Then I see a level 1 section heading with the text "Hammerflügel"

  Scenario: Media thumbnail grid for multiple web resources
    When I open the `"Hammerflügel" record page`
    And I see the `media thumbnail grid`
    And the `media thumbnail #1` is marked as "selected"
    And I click the `media thumbnail #2`
    And I wait 1 second
    Then the `media thumbnail #2` is marked as "selected"

  Scenario: No media thumbnail grid for single web resources
    When I open `"The Milkmaid" record page`
    Then I don't have the `media thumbnail grid`

  Scenario: Similar items
    When I open `"The Milkmaid" record page`
    Then I see `similar items`

  Scenario: Audio player
    When I open the `"The pride of Glencoe, song" record page`
    Then I see a `audio player`
    And I am on an accessible page

  Scenario: IIIF Image viewer
    When I open a `record page with a IIIF Image`
    Then I see the `IIIF viewer`
    And I am on an accessible page

  Scenario: IIIF Presentation viewer
    When I open a `record page with a IIIF Presentation`
    Then I see the `IIIF viewer`
    And I am on an accessible page
