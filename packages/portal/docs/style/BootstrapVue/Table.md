Customised BootstrapVue table component.

Docs including more features: https://bootstrap-vue.org/docs/components/table

The [complete example](https://bootstrap-vue.org/docs/components/table#complete-example) can be useful to extend table functionalities.

Used by:
- EntityTable

```jsx
<template>
  <div>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
      }
    }
  }
</script>
```
