<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ page.headline }}
      </h1>

      <p>{{ page.text }}</p>

      <div
        v-for="section in page.hasPart"
        :key="section.sys.id"
        class="banner"
      >
        <h2>{{ section.fields.headline }}</h2>
        <p>{{ section.fields.text }}</p>

        <b-card-group deck>
          <ContentCard
            v-for="card in section.fields.hasPart"
            :key="card.sys.id"
            :name="card.fields.name"
            :description="card.fields.description"
            :url="card.fields.url"
            :image-url="card.fields.image.fields.file.url"
            :image-title="card.fields.image.fields.title"
          />
        </b-card-group>
      </div>
    </div>
  </section>
</template>

<script>
  import ContentCard from '~/components/ContentCard.vue';
  import contentfulClient from '~/plugins/contentful.js';

  export default {
    asyncData ({ params, error }) {
      // fetch the browsePage data, include set to 2 in order to get nested card data
      return contentfulClient.getEntries({
        'content_type': 'browsePage',
        'fields.identifier': params.pathMatch == '' ? '/' : params.pathMatch,
        'include': 2,
        'limit': 1
      })
        .then((response) => {
          if (response.total == 0) {
            error({ statusCode: 404, message: 'Not Found' });
            return;
          }
          return {
            page: response.items[0].fields
          };
        })
        .catch((e) => {
          error({ statusCode: 500, message: e.toString() });
        });
    },
    components: {
      ContentCard
    },
    head () {
      return {
        title: this.page.headline
      };
    }
  };
</script>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .banner{
    text-align: center;
  }

  .banner ul{
    margin: auto;
  }
</style>
