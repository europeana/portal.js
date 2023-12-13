Customised BootstrapVue list group component.

Docs including more features and variants: https://bootstrap-vue.org/docs/components/list-group

Used by:
- [LinkList](/#/Components/Generic?id=linklist)
- [SearchQueryOptions](/#/Components/Search?id=searchqueryoptions)

Also see:
- [LinkGroup](/#/Components/Generic?id=linkgroup)

List group
```jsx
  <b-list-group>
    <b-list-group-item>List group item</b-list-group-item>
    <b-list-group-item>List group item</b-list-group-item>
    <b-list-group-item>List group item</b-list-group-item>
    <b-list-group-item>List group item</b-list-group-item>
  </b-list-group>
```

Actionable list group with links
```jsx
  <b-list-group>
    <b-list-group-item href="#">Awesome link</b-list-group-item>
    <b-list-group-item href="#" active>Link with active state</b-list-group-item>
    <b-list-group-item href="#">Action links are easy</b-list-group-item>
    <b-list-group-item href="#" disabled>Disabled link</b-list-group-item>
  </b-list-group>
