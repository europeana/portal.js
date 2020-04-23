Feature: Blog page

  Scenario: Blog Sections & Cards

    When I open the `blog page`
    Then I see a `content card` in the `blog posts section`
    And I am on an accessible page
  
  Scenario: See Disqus comments widget
    When I open the `"Easter with art" blog page`
    Then I see the `disqus widget`
