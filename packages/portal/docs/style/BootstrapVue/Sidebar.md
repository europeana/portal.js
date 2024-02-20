Customised BootstrapVue sidebar component.

Docs including more features, styles and variants: https://bootstrap-vue.org/docs/components/sidebar

Used by:
- [PageHeader](/#/Components/Page?id=pageheader)

Default
```jsx
  <div>
    <b-button v-b-toggle.sidebar-1>Toggle Sidebar</b-button>
    <b-sidebar id="sidebar-1" title="Sidebar">
      <div class="px-3 py-2">
        <p>
          In a sidebar we can put all kinds of elements: text, navigation items, lists, forms, images etc.
        </p>
        <b-nav>
          <b-nav-item active>Active</b-nav-item>
          <b-nav-item>Link</b-nav-item>
          <b-nav-item>Another Link</b-nav-item>
          <b-nav-item disabled>Disabled</b-nav-item>
        </b-nav>
        <b-list-group>
          <b-list-group-item>List group item</b-list-group-item>
          <b-list-group-item>List group item</b-list-group-item>
          <b-list-group-item>List group item</b-list-group-item>
          <b-list-group-item>List group item</b-list-group-item>
        </b-list-group>
        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2" description="Description about name field">
          <b-form-input
            id="input-2"
            placeholder="Enter name"
          ></b-form-input>
        </b-form-group>
        <b-img :src="thumbnails[0]" fluid thumbnail></b-img>
      </div>
    </b-sidebar>
  </div>
```
