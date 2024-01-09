Customised BootstrapVue dropdown component.

Docs: https://bootstrap-vue.org/docs/components/dropdown

Used by:
- ItemLanguageSelector
- LanguageSelector
- [SearchFacetDropdown](/#/Components/Search?id=searchfacetdropdown)
- [SearchQueryRuleDropdown](/#/Components/Search?id=searchquerybuilderruledropdown)

```jsx
  <b-dropdown text="Default variant dropdown">
    <b-dropdown-item href="#">An item</b-dropdown-item>
    <b-dropdown-item href="#">Another item</b-dropdown-item>
  </b-dropdown>

  <b-dropdown variant="light" text="Light variant dropdown">
    <b-dropdown-item href="#">An item</b-dropdown-item>
    <b-dropdown-item href="#">Another item</b-dropdown-item>
  </b-dropdown>

  <b-dropdown variant="link" text="Link variant dropdown">
    <b-dropdown-item href="#">An item</b-dropdown-item>
    <b-dropdown-item href="#">Another item</b-dropdown-item>
  </b-dropdown>

  <b-dropdown text="Dropdown with group" class="mt-3">
    <b-dropdown-item-button>
      Non-grouped Item
    </b-dropdown-item-button>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-group id="dropdown-group-1" header="Group 1">
      <b-dropdown-item-button>First Grouped item</b-dropdown-item-button>
      <b-dropdown-item-button>Second Grouped Item</b-dropdown-item-button>
    </b-dropdown-group>
    <b-dropdown-group id="dropdown-group-2" header="Group 2">
      <b-dropdown-item-button>First Grouped item</b-dropdown-item-button>
      <b-dropdown-item-button>Second Grouped Item</b-dropdown-item-button>
    </b-dropdown-group>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item-button>
      Another Non-grouped Item
    </b-dropdown-item-button>
  </b-dropdown>
  ```
