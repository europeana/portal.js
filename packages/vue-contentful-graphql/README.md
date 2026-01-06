# `@europeana/vue-contentful-graphql`

Vue plugin for querying the
[Contentful GraphQL Content API](https://www.contentful.com/developers/docs/references/graphql/).


## Installation

Install the package:
```sh
npm install --save @europeana/vue-contentful-graphql
```

## Configure

```js
const config = {
  // ID of your Contentful space [required]
  spaceId: 'SPACE_ID',
  // ID of your Contentful environment [required]
  environmentId: 'ENVIRONMENT_ID',
  accessToken: {
    // Contentful Delivery API access token [required]
    delivery: 'DELIVERY_API_ACCESS_TOKEN',
    // Contentful Preview API access token [required]
    preview: 'PREVIEW_API_ACCESS_TOKEN'
  },
  // Base URL of the Contentful GraphQL Content API [optional]
  graphQlOrigin: 'https://graphql.contentful.com',
};
```

## Setup

Register the Vue plugin:
<!-- TODO: show how to reigster in Vue 3 too -->
```js
import Vue from 'vue';
import VueContentfulGraphql from '@europeana/vue-contentful-graphql';

Vue.use(VueContentfulGraphql, config);
```

A global property `$contentful` will now be registered on the Vue app.

## Usage

### `$contentful.query`

#### Parameters

- `ast`: GraphQL AST object for the query to send to the API [required]
- `variables`: Key-value pairs of variables to use in the query [optional]
  - `.preview`: If `variables.preview` is `true`, then the Preview API access
    token will be used; otherwise the Delivery API access token

#### Example
```js
import Vue from 'vue';
import gql from 'graphql-tag';

const query = `query Page($url: String!) {
  PageCollection(url: $url) {
    items {
      title
      body
    }
  }
}`;
const ast = gql`${query}`;

Vue.component('ContentfulPage', {
  data() {
    return {
      body: null,
      title: null
    };
  },

  async created() {
    const variables = {
      url: this.$route.path
    };

    const response = await this.$contentful.query(ast, variables);

    const page = response.data.pageCollection.items[0];
    this.title = page.title;
    this.body = page.body;
  },

  template: `
    <article>
      <h1>{{ title }}</h1>
      <section>{{ body }}</section>
    </article>
  `
});
```

## License

Licensed under the EUPL v1.2.
