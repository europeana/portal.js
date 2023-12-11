Bax shadows are used to distinguish a component from its background and/or as hover effect.
```jsx
<b-table
  fixed
  :fields="[{
    key: 'boxshadow',
    label: 'Box shadow'
  }, {
    key: 'name',
    label: 'Name'
  }, {
    key: 'code',
    label: 'Code'
  }]"
  :items="[{ name: 'boxshadow-light', code: '2px 2px 4px 0 rgb(0 0 0 / 10%)' },
  { name: 'boxshadow-light-left', code: '-2px 2px 4px 0 rgb(0 0 0 / 10%)' },
  { name: 'boxshadow', code: '0 4px 8px 0 rgb(0 0 0 / 15%)' },
  { name: 'boxshadow-small', code: '0 1px 3px 0 rgb(0 0 0 / 25%)' },
  { name: 'boxshadow-large', code: '0 4px 12px 0 rgb(0 0 0 / 40%)' }]"
>
  <template #cell(boxshadow)="data">
    <div
      :style="`border-radius: 0.375rem; padding: 1rem; box-shadow: ${data.item.code};`"
    >
      {{ data.value }}
    </div>
  </template>
</b-table>
```
