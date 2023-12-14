Customised BootstrapVue tooltip component.

Docs including more features: https://bootstrap-vue.org/docs/components/tooltip

Used by:
- ContentCard (mosaic variant)
- RightsStatementButton
- ItemAddButton
- ItemLanguageSelector
- ItemLikeButton
- MetadataOriginLabel
- SearchFacetDropdown (theme)
- SearchForm (collapse toggle)
- SearchQueryBuilderRule
- SearchQueryBuilderRuleDropdown
- SearchSidebar
- SearchSwitchFilter
- SetPublicationRequestWidget
- ShareSocialButton (Weave)
- UserButtons (item drag button)
- UserSets (set count label or when zero sets)

```jsx
<div class="text-center my-3">
  <b-button v-b-tooltip.bottom title="This tooltip appears at the bottom on hover and focus">
    Hover or tab for tooltip
  </b-button>

  <b-button id="tooltip-target-1">
    Hover or tab for tooltip with a link
  </b-button>
  <b-tooltip target="tooltip-target-1" placement="bottom">
    <span>This tooltip contains a link <b-link href="/#">link</b-link></span>
  </b-tooltip>
</div>
```
