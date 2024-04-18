These are the base definitions for font sizes and weights in the portal code. Per component and text element there might be specific overwrites.

1 rem = 16px

For 4k viewports (3020px and up) the general rule is an 150% increase.

```jsx
<template>
  <b-table
    :fields="fields"
    :items="fontStyles"
    outlined
  >
    <template #cell(show_details)="row">
      <b-button
        v-if="row.item.responsive || row.item.usedBy"
        variant="light-flat"
        class="font-large"
        @click="row.toggleDetails"
      >
        {{ row.detailsShowing ? '-' : '+' }}
      </b-button>
    </template>
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
    <template #row-details="row">
      <b-table
        v-if="row.item.responsive"
        :fields="['breakpoint', 'style', 'size']"
        :items="row.item.responsive"
        outlined
      >
        <template #cell(style)="data">
          <span
            :style="`font-family: ${row.item.font}; font-size: ${data.item.size}rem; font-weight: ${row.item.weight}; text-transform: ${row.item.case}; color: ${row.item.color};`"
          >
            {{ row.item.style }}
          </span>
        </template>
        <template #cell(size)="data">
          <code>
            {{ `${data.value}rem (${data.value * 16}px)` }}
          </code>
        </template>
      </b-table>
      <b-card
        v-if="row.item.usedBy"
        no-body
        header="Example use cases"
        class="d-inline-block"
      >
        <b-list-group flush>
          <b-list-group-item
            v-for="element, index in row.item.usedBy"
            :key="index"
            :href="element.hash"
          >
            {{ element.label }}
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </template>
  </b-table>
</template>

<script>
  export default {
    data() {
      return {
        fields: [
          { key: 'show_details', label: 'Details' },
          { key: 'style', label: 'Style' },
          { key: 'font', label: 'Font', sortable: true },
          { key: 'size', label: 'Size', sortable: true },
          { key: 'weight', label: 'Weight', sortable: true },
          { key: 'case', label: 'Case', sortable: true },
          { key: 'color', label: 'Color' }
        ],
        fontStyles: [
          { style: 'Title 1', font: 'Ubuntu', size: '2.875', weight: '700', case: 'none', responsive: [{ breakpoint: 'small', size: '2.125' }, { breakpoint: '4k', size: '4.3125' }],
            usedBy: [{ label: 'Home hero h1', hash: '/#/Components/Home?id=homehero' }, { label: 'Landing hero h1', hash: '/#/Components/Landing?id=landinghero' }] },
          { style: 'Title 2', font: 'Ubuntu', size: '2.125', weight: '500', case: 'none', responsive: [{ breakpoint: 'small', size: '1.375' }, { breakpoint: '4k', size: '4.75' }],
            usedBy: [{ label: 'Landing page h2', hash: '/#/Components/Landing?id=landingsubsection' }] },
          { style: 'Title 3', font: 'Ubuntu', size: '1.75', weight: '500', case: 'none', responsive: [{ breakpoint: 'small', size: '1' }, { breakpoint: '4k', size: '4' }],
            usedBy: [{ label: 'Landing page h3', hash: '/#/Components/Landing?id=landingsubsection' }] },
          { style: 'Title 4', font: 'Ubuntu', size: '1.5', weight: '500', case: 'none', responsive: [{ breakpoint: 'small', size: '1.25' }, { breakpoint: '4k', size: '2.25' }],
            usedBy: [{ label: 'Entity header title', hash: '/#/Components/Entity?id=entityheader' }] },
          { style: 'Title 5', font: 'Open Sans', size: '0.875', weight: '600', case: 'uppercase', responsive: [{ breakpoint:  'small', size: '0.875' }, { breakpoint: '4k', size: '2.125' }],
            usedBy: [{ label: 'Landing automated card group', hash: '/#/Components/Landing?id=landingautomatedcardgroup' }] },
          { style: 'Subtitle 1', font: 'Open Sans', size: '2.375', weight: '400', case: 'none', color: '#4d4d4d', responsive: [{ breakpoint: 'small', size: '2' }, { breakpoint: '4k', size: '3.5625' }],
            usedBy: [{ label: 'Home page h2', hash: '/#/Components/Generic?id=stackedcardsswiper' }] },
          { style: 'Subtitle 2', font: 'Open Sans', size: '1.875', weight: '400', case: 'none',
            usedBy: [{ label: 'h2 base' }] },
          { style: 'Subtitle 3', font: 'Open Sans', size: '2.125', weight: '700', case: 'none', responsive: [{ breakpoint: 'small', size: '1.5' }, { breakpoint: '4k', size: '3.1875' }],
            usedBy: [{ label: 'CTA banner title', hash: '/#/Components/Generic?id=calltoactionbanner' }] },
          { style: 'Lead paragraph', font: 'Open Sans', size: '1.5', weight: '400', case: 'none', color: '#4d4d4d', responsive: [{ breakpoint: 'small', size: '1' }, { breakpoint: '4k', size: '2.25' }],
            usedBy: [{ label: 'Lead paragraph in stories' }] },
          { style: 'Body large', font: 'Open Sans', size: '1.125', weight: '400', case: 'none', usedBy: [{ label: 'paragraph text on text heavy pages' }] },
          { style: 'Body regular', font: 'Open Sans', size: '1', weight: '400', case: 'none', usedBy: [{ label: 'paragraph text' }] },
          { style: 'Navigation / pagination', font: 'Open Sans', size: '0.875', weight: '600', case: 'uppercase', responsive: [{ breakpoint: '4k', size: '1.3125' }], usedBy: [{ label: 'Page header navigation', hash: '/#/Components/Page?id=pageheader' }, { label: 'Pagination' }] },
          { style: 'Label 1', font: 'Open Sans', size: '0.875', weight: '600', case: 'uppercase', color: '#4d4d4d', responsive: [{ breakpoint: '4k', size: '1.3125' }], usedBy: [{ label: 'Related content heading', hash: '/#/Components/Related?id=relatedcategorytags' }, { label: 'Search results context' }, { label: 'Stories results context' }] },
          { style: 'Label 2', font: 'Open Sans', size: '0.75', weight: '600', case: 'uppercase', color: '#4d4d4d', usedBy: [{ label: 'Story page type label' }, { label: 'Gallery page type label' }] },
          { style: 'Component text 1', font: 'Open Sans', size: '0.875', weight: '400', case: 'none', usedBy: [{ label: 'Breadcrumbs', hash: '/#/Style/Bootstrap Vue?id=breadcrumb' }, { label: 'Card text', hash: '/#/Components/Content?id=contentcard' }, { label: 'metadata fields' }] },
          { style: 'Component text 1 semibold', font: 'Open Sans', size: '0.875', weight: '600', case: 'none', usedBy: [{ label: 'collection table headers' }] },
          { style: 'Component text 2', font: 'Open Sans', size: '0.75', weight: '400', case: 'none', usedBy: [{ label: 'Help text', hash: '/#/Style/Bootstrap Vue?id=form' }] },
          { style: 'Component text 3', font: 'Open Sans', size: '0.625', weight: '400', case: 'none', responsive: [{ breakpoint: 'wqhd', size: '1' }], usedBy: [{ label: 'Footer disclaimer', hash: '/#/Components/Page?id=pagefooter' }] }
        ]
      };
    }
  };
</script>

```
