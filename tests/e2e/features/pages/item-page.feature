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
    And I see a `add button`
    And I see a `like button`

  Scenario: Share Modal

    When I open an `item page`
    And I see a `share button`
    And I click a `share button`
    Then I see a `share modal`
    And I see a `share facebook button`
    And I see a `share x button`
    And I see a `share pinterest button`

  Scenario: Record without isShownBy or hasView

    When I open an `item page without isShownBy or hasView`
    Then I see the `item page`
    And I see the `default thumbnail`

  Scenario: One related entity
    When I open `"The Milkmaid" item page`
    Then I see `related entities`
    And I see the `Art of painting related chip` in the `related entities`

  Scenario: Multiple related entities
    When I open the `"Het laatste avondmaal" item page`
    Then I see `related entities`
    And I see the `Italy related chip` in the `related entities`
    And I see the `Paper related chip` in the `related entities`
    And I see the `Print related chip` in the `related entities`
    And I see the `Leonardo da Vinci related chip` in the `related entities`
    And I see the `data provider badge` in the `data provider attribution`

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

  Scenario: Copying embed code
    When I open the `"Het laatste avondmaal" item page`
    And  I click the `share button`
    And  I click the `share embed textarea`
    Then I see a `share embed copied notice`

  Scenario: Location tab with map embed when dcterms:spatial has co-ordinates
    Given I am on the `search page`
    When I click the `show search button`
    And I enter "pl_wgs84_pos_lat:* pl_wgs84_pos_long:* proxy_dcterms_spatial:http\://data.europeana.eu*" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "pl_wgs84_pos_lat:* pl_wgs84_pos_long:* proxy_dcterms_spatial:http\://data.europeana.eu*"
    And I click a `item preview`
    And I see an `item page`
    And I hover over the `metadata box`
    And I click the `location tab`
    Then I see a `map embed`

  Scenario: No location tab when dcterms:spatial has no co-ordinates
    Given I am on the `search page`
    When I click the `show search button`
    And I enter "NOT proxy_dcterms_spatial:* pl_wgs84_pos_lat:* pl_wgs84_pos_long:*" in the `search box`
    And I press the ENTER key
    And I see a `context label` with the text "NOT proxy_dcterms_spatial:* pl_wgs84_pos_lat:* pl_wgs84_pos_long:*"
    And I click a `item preview`
    And I see an `item page`
    And I hover over the `metadata box`
    Then there is no `location tab`

  Scenario: Seeing an item language selector
    When I open an `item page`
    Then I see an `item language selector`
    Then I see a `translate item login suggestion`

  @resized-browser
  Scenario: HTML embedded media
    When I open an `item page with a responsive embedded video`
    And I resize the window to 1200 by 500
    Then The iframe does not overflow `responsive embed wrapper`
