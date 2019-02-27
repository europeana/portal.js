<template>
  <b-container
    v-if="error"
    class="mb-3"
  >
    <b-alert
      show
      variant="dark"
    >
      <strong>Error:</strong> {{ error }}
    </b-alert>
  </b-container>
  <b-container v-else>
    <b-row>
      <b-col><h1>Record</h1></b-col>
    </b-row>
    <b-row class="mb-3">
      y<b-col
        v-if="image.src"
        cols="12"
        md="4"
      >
        <a :href="image.link">
          <img
            :src="image.src"
            class="mw-100 mb-3"
          >
        </a>
      </b-col>
      <b-col>
        <div
          v-for="(value, key) in fields"
          :key="key"
          class="border-bottom mb-3"
        >
          <div><strong>{{ key }}</strong></div>
          <pre><code>{{ value }}</code></pre>
        </div>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <h2>Media</h2>
        <b-list-group>
          <b-list-group-item
            v-for="webResource in media"
            :key="webResource.rdfAbout"
            class="mb-3"
          >
            <div
              v-for="(value, key) in webResource"
              :key="key"
            >
              <div><strong>{{ key }}</strong></div>
              <pre><code>{{ value }}</code></pre>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import getRecord from '../../plugins/record';

  export default {
    asyncData: ({ env, params }) => ({
      record: getRecord({
        path: params.pathMatch,
        key: env.EUROPEANA_API_KEY
      })
    }),
    head () {
      return {
        title: 'Record'
      };
    }
  };
</script>
