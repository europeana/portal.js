# Query sanitiser

Nuxt module to perform sanitisation of HTTP request query parameters.

## Installation
In nuxt.config.js:
```js
{
  buildModules: [
    '~/modules/query-sanitiser'
  ]
}
```

## Parameter sanitisation

### page

The `page` parameter is used for pagination. Sanitisation of it will:
1. If the parameter is not present, interpret as page 1, but do not redirect
2. If the parameter is present and a positive integer, use it
3. If the parameter is present and any other value, redirect to `page=1`

Enable sanitisation of `page` parameter:
```js
export default {
  middleware: 'sanitisePageQuery'
};
```

Retrieve the sanitised `page` parameter:
```js
export default {
  fetch() {
    const page = this.$store.state.sanitised.page;
    // Paginate something
  }
};
```
