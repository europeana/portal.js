Box shadows are used to distinguish a component from its background and/or as hover effect.
```jsx
<template>
  <div>
    <b-table
      fixed
      :fields="boxShadowFields"
      :items="boxShadowItems"
    >
      <template #cell(boxshadow)="data">
        <div
          :style="`border-radius: 0.375rem; padding: 1rem; box-shadow: ${data.item.code};`"
        >
          {{ data.value }}
        </div>
      </template>
    </b-table>

    <b-table
      fixed
      :fields="borderRadiusFields"
      :items="borderRadiusItems"
    >
      <template #cell(borderradius)="data">
        <div
          :style="`border-radius: ${data.item.code}; padding: 1rem; border: 1px solid #000;`"
        >
          {{ data.value }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        boxShadowFields: [
          { key: 'boxshadow', label: 'Box-shadow' },
          { key: 'name', label: 'Name' },
          { key: 'code', label: 'Code' }
        ],
        boxShadowItems: [
          { name: 'boxshadow-light', code: '2px 2px 4px 0 rgb(0 0 0 / 10%)' },
          { name: 'boxshadow-light-left', code: '-2px 2px 4px 0 rgb(0 0 0 / 10%)' },
          { name: 'boxshadow', code: '0 4px 8px 0 rgb(0 0 0 / 15%)' },
          { name: 'boxshadow-small', code: '0 1px 3px 0 rgb(0 0 0 / 25%)' },
          { name: 'boxshadow-large', code: '0 4px 12px 0 rgb(0 0 0 / 40%)' }
        ],
        borderRadiusFields: [
          { key: 'borderradius', label: 'Border-radius' },
          { key: 'name', label: 'Name' },
          { key: 'code', label: 'Code' }
        ],
        borderRadiusItems: [
          { name: 'border-radius-small', code: '0.25rem' },
          { name: 'border-radius', code: '0.375rem' },
          { name: 'border-radius-large', code: '0.5rem' }
        ]
      };
    }
  };
</script>
```
