Customised BootstrapVue breadcrumb component.

Docs: https://bootstrap-vue.org/docs/components/breadcrumb

Used by:
- default layout (only populated by blog and exhibitions)

```jsx
  <div style="margin-left: -16px; margin-right: -16px;">
    <b-breadcrumb
      :items="[{ text: 'Main page',
                to: '#' },
                { text: 'Sub page',
                to: '#' },
              { text: 'Sub page',
                active: true
              }]"
    />
  </div>
```
