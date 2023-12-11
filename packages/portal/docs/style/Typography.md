More info about font styles and examples where they are applied can be found on the [Typography page on Figma](https://www.figma.com/file/TQHeWavFSkWCWGMntlthcJ/Component-Library?type=design&node-id=2330%3A6894&mode=design&t=7ZfmXiyHHKs1NQqO-1) and the [Font styles page in Confluence](https://europeana.atlassian.net/wiki/spaces/EC/pages/2279047169/Font+styles)
```jsx
<b-table
  :fields="[{
    key: 'style',
    label: 'Style'
  }, {
    key: 'font',
    label: 'Font',
    sortable: true
  }, {
    key: 'size',
    label: 'Size',
    sortable: true
  }, {
    key: 'weight',
    label: 'Weight',
    sortable: true
  }, {
    key: 'case',
    label: 'Case',
    sortable: true
  }, {
    key: 'color',
    label: 'Color'
  }]"
  :items="[{ style: 'Title 1', font: 'Ubuntu', size: '2.875', weight: '700', case: 'none' },
  { style: 'Title 2', font: 'Ubuntu', size: '2.125', weight: '500', case: 'none' },
  { style: 'Title 3', font: 'Ubuntu', size: '1.75', weight: '500', case: 'none' },
  { style: 'Title 4', font: 'Ubuntu', size: '1.5', weight: '500', case: 'none' },
  { style: 'Title 5', font: 'Ubuntu', size: '1.25', weight: '500', case: 'none' },
  { style: 'Subtitle 1', font: 'Open Sans', size: '2.375', weight: '400', case: 'none' },
  { style: 'Subtitle 2', font: 'Open Sans', size: '2.125', weight: '400', case: 'none' },
  { style: 'Subtitle 3', font: 'Open Sans', size: '1.5', weight: '400', case: 'none' },
  { style: 'Subtitle 4', font: 'Open Sans', size: '1.25', weight: '400', case: 'none' },
  { style: 'Lead paragraph', font: 'Open Sans', size: '1.5', weight: '400', case: 'none', color: '#4d4d4d' },
  { style: 'Body large', font: 'Open Sans', size: '1.125', weight: '400', case: 'none' },
  { style: 'Body regular', font: 'Open Sans', size: '1', weight: '400', case: 'none' },
  { style: 'Navigation / pagination', font: 'Open Sans', size: '0.875', weight: '600', case: 'uppercase' },
  { style: 'Label 1', font: 'Open Sans', size: '0.875', weight: '600', case: 'uppercase', color: '#4d4d4d' },
  { style: 'Label 2', font: 'Open Sans', size: '0.75', weight: '600', case: 'uppercase', color: '#4d4d4d' },
  { style: 'Component text 1', font: 'Open Sans', size: '0.875', weight: '400', case: 'none' },
  { style: 'Component text 1 semibold', font: 'Open Sans', size: '0.875', weight: '600', case: 'none' },
  { style: 'Component text 2', font: 'Open Sans', size: '0.75', weight: '400', case: 'none' },
  { style: 'Component text 3', font: 'Open Sans', size: '0.625', weight: '400', case: 'none' },]"
>
  <template #cell(style)="data">
    <span
      :style="`font-family: ${data.item.font}; font-size: ${data.item.size}rem; font-weight: ${data.item.weight}; text-transform: ${data.item.case}; color: ${data.item.color};`"
    >
      {{ data.value }}
    </span>
  </template>
  <template #cell(font)="data">
    <code>
      {{ data.value }}
    </code>
  </template>
  <template #cell(size)="data">
    <code>
      {{ `${data.value}rem (${data.value * 16}px)` }}
    </code>
  </template>
    <template #cell(weight)="data">
    <code>
      {{ data.value }}
    </code>
  </template>
  <template #cell(case)="data">
    <code>
      {{ data.value }}
    </code>
  </template>
  <template #cell(color)="data">
    <code>
      {{ data.value }}
    </code>
  </template>
</b-table>
```
