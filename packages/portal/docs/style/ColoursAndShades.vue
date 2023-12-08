<docs lang="md">
Colours are also defined on the [Colours page on Figma](https://www.figma.com/file/TQHeWavFSkWCWGMntlthcJ/Component-Library?type=design&node-id=2331-6895&mode=design&t=Itwqh68olLjRr6ON-0)
```jsx
<b-table
  fixed
  :fields="[{
    key: 'colour',
    label: 'Colour'
  }, {
    key: 'name',
    label: 'Name'
  }, {
    key: 'hex',
    label: 'Hex'
  }]"
  :items="[{ name: 'white', hex: '#fff' },
            { name: 'middlegrey', hex: '#d8d8d8' },
            { name: 'mediumgrey-light', hex: '#767676' },
            { name: 'grey', hex: '#777' },
            { name: 'offwhite', hex: '#f1f1ee' },
            { name: 'paper', hex: '#d9d4ca' },
            { name: 'lightbluemagenta', hex: '#e7e7e9' },
            { name: 'smoke', hex: '#f5f5f5' },
            { name: 'illustration-whitegrey', hex: '#efece8' },
            { name: 'whitegrey', hex: '#e0e0e0' },
            { name: 'lightgrey', hex: '#a6a6a6' },
            { name: 'mediumgrey', hex: '#4d4d4d' },
            { name: 'bodygrey', hex: '#ededed' },
            { name: 'black', hex: '#000' },
            { name: 'greyblack', hex: '#1a1a1a' },
            { name: 'innovationblue', hex: '#0a72cc' },
            { name: 'innovationblue-dark', hex: '#0963b3' },
            { name: 'blue', hex: '#0a72cc' },
            { name: 'blue-20', hex: '#0a72cc20' },
            { name: 'darkblue', hex: '#085395' },
            { name: 'lightblue', hex: '#daeaf8' },
            { name: 'lightblue-dark', hex: '#c1dbf2' },
            { name: 'lightblue-light', hex: '#e2f2fe' },
            { name: 'skyblue', hex: '#bcd8f1' },
            { name: 'red', hex: '#e02020' },
            { name: 'yellow', hex: '#ffae00' },
            { name: 'yellowhighlight', hex: '#ffcb56' },
            { name: 'yellowgrey', hex: '#d9d4ca' },
            { name: 'green', hex: '#1d872b' },
            { name: 'lightgreen', hex: '#71c07b' },
            { name: 'darkgreen', hex: '#197324' },
            { name: 'textcolor', hex: '#1a1a1a' }]"
>
  <template #cell(colour)="data">
    <div
      :style="`border: 1px solid black; padding: 1rem; background-color: ${data.item.hex};`"
    >
      {{ data.value }}
    </div>
  </template>
</b-table>
```
</docs>
