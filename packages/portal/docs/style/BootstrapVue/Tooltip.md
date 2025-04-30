Customised BootstrapVue tooltip component.

Docs including more features: https://bootstrap-vue.org/docs/components/tooltip

Used by:

- [ContentCard (mosaic variant)](/#/Components/Content?id=contentcard)
- [ItemAddButton](/#/Components/Item?id=itempreviewcard)
- ItemLanguageSelector
- [ItemLikeButton](/#/Components/Item?id=itempreviewcard)
- MetadataOriginLabel
- RightsStatementButton
- [SearchFacetDropdown (theme)](/#/Components/Search?id=searchfacetdropdown)
- SearchForm (collapse toggle)
- [SearchQueryBuilderRule](/#/Components/Search?id=searchquerybuilderrule)
- [SearchQueryBuilderRuleDropdown](/#/Components/Search?id=searchquerybuilderruledropdown)
- SearchSidebar
- [SearchSwitchFilter](/#/Components/Search?id=searchswitchfilter)
- SetPublicationRequestWidget
- ShareSocialButtons (Weave)
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
    <span>This tooltip contains a <b-link href="/#">link</b-link></span>
  </b-tooltip>

  <b-button id="tooltip-target-2" variant="primary">
    Hover or tab for primary variant
  </b-button>
  <b-tooltip target="tooltip-target-2" placement="bottom" variant="primary">
    <span>This tooltip is used to call the user's attention to for example a new feature</span>
  </b-tooltip>
</div>
```
