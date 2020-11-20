Feature: item page

  Scenario: View any existing item page

    When I open an `item page`
    Then I see the `item page`
    And I see the `main metadata section`
    And I see a `metadata field`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Attempting to view an item page which doesn't exist

    When I open `/en/item/123456/THIS_IDENTIFIER_DOES_NOT_EXIST`
    Then I see an `error notice`
    And I am on an accessible page
    And I should have a Europeana branded page title

  Scenario: Multiple items displayed in swiper

    When I open `/en/item/142/UEDIN_214`
    Then I see a `awesome swiper`

  Scenario: Action bar

    When I open an `item page`
    Then I see an `action bar`
    And I see a `rights statement`
    And I see a `share button`
    And I see a `download button`

  Scenario: Share Modal

    When I open an `item page`
    And I see a `share button`
    And I click a `share button`
    Then I see a `share modal`
    And I see a `share facebook button`
    And I see a `share twitter button`
    And I see a `share pinterest button`

  Scenario: Record without isShownBy or hasView

    When I open an `item page without isShownBy or hasView`
    Then I see the `item page`
    And I see the `media preview image`

  Scenario: One related entity
    When I open `"The Milkmaid" item page`
    Then I see `related entities`
    And I see the `Painting related chip` in the `related entities`

  Scenario: Multiple related entities
    When I open the `"Het laatste avondmaal" item page`
    Then I see `related entities`
    And I see the `Leonardo da Vinci related chip` in the `related entities`
    And I see the `Teodoro Matteini related chip` in the `related entities`
    And I see the `Engraving related chip` in the `related entities`

  Scenario: Metadata in another language
    When I open the `"Hammerflügel" item page`
    Then I see a level 1 section heading with the text "Hammerflügel"

  Scenario: Similar items
    When I open `"The Milkmaid" item page`
    Then I see `similar items`

  Scenario: Media player for audio
    When I open the `"The pride of Glencoe, song" item page`
    Then I see the `media player`

  Scenario: IIIF Image viewer
    When I open an `item page with a IIIF Image`
    Then I see the `IIIF viewer`
    And I am on an accessible page

  Scenario: IIIF Presentation viewer
    When I open an `item page with a IIIF Presentation`
    Then I see the `IIIF viewer`
    And I am on an accessible page

  Scenario: Seeing a notification banner
    When I open an `item page`
    Then I see a `notification banner`

  Scenario: Copying embed code
    When I open the `"Het laatste avondmaal" item page`
    And  I click the `share button`
    And  I click the `share embed textarea`
    Then I see a `share embed copied notice`
