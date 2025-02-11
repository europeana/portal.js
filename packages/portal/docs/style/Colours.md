Colours are also defined on the [Colours page on Figma](https://www.figma.com/file/TQHeWavFSkWCWGMntlthcJ/Component-Library?type=design&node-id=2331-6895&mode=design&t=Itwqh68olLjRr6ON-0)

```jsx
<template>
  <b-table
    fixed
    :fields="fields"
    :items="items"
  >
    <template #cell(colour)="data">
      <div
        :style="`border: 1px solid black; padding: 1rem; background-color: ${data.item.hex};`"
      >
        {{ data.value }}
      </div>
    </template>
  </b-table>
</template>

<script>
  export default {
    data() {
      return {
        fields: [
          { key: 'colour', label: 'Colour' },
          { key: 'name', label: 'Name' },
          { key: 'hex', label: 'Hex' }
        ],
        items: [
          { name: 'white', hex: '#fff' },
          { name: 'smoke', hex: '#f5f5f5' },
          { name: 'offwhite', hex: '#f1f1ee' },
          { name: 'bodygrey', hex: '#ededed' },
          { name: 'illustration-whitegrey', hex: '#efece8' },
          { name: 'lightbluemagenta', hex: '#e7e7e9' },
          { name: 'whitegrey', hex: '#e0e0e0' },
          { name: 'middlegrey', hex: '#d8d8d8' },
          { name: 'paper', hex: '#d9d4ca' },
          { name: 'lightgrey', hex: '#a6a6a6' },
          { name: 'grey', hex: '#777' },
          { name: 'darkgrey-light', hex: '#767676' },
          { name: 'darkgrey', hex: '#4d4d4d' },
          { name: 'greyblack', hex: '#1a1a1a' },
          { name: 'textcolor', hex: '#1a1a1a' },
          { name: 'black', hex: '#000' },
          { name: 'lightblue-light', hex: '#e2f2fe' },
          { name: 'lightblue', hex: '#daeaf8' },
          { name: 'lightblue-dark', hex: '#c1dbf2' },
          { name: 'skyblue', hex: '#bcd8f1' },
          { name: 'blue-20', hex: '#0a72cc20' },
          { name: 'blue', hex: '#0a72cc' },
          { name: 'innovationblue', hex: '#0a72cc' },
          { name: 'innovationblue-dark', hex: '#0963b3' },
          { name: 'darkblue', hex: '#085395' },
          { name: 'lightpurple', hex: '#c697fc'}
          { name: 'lightpurple-light', hex: '#d4b1fd'}
          { name: 'red', hex: '#e02020' },
          { name: 'yellowgrey', hex: '#d9d4ca' },
          { name: 'yellow', hex: '#ffae00' },
          { name: 'lightgreen', hex: '#71c07b' },
          { name: 'green', hex: '#1d872b' },
          { name: 'darkgreen', hex: '#197324' }
        ]
      };
    }
  };
</script>
```
