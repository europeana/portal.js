<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ page.pageTitle }}
      </h1>

      <p>{{ page.pageDescription }}</p>

      <div
        v-for="section in page.section"
        :key="section.sys.id"
        class="banner">
        <h2>{{ section.fields.description }}</h2>

        <b-card-group deck>
          <ContentCard
            v-for="card in section.fields.contentCards"
            :key="card.sys.id"
            :card-title="card.fields.cardTitle"
            :content-source="card.fields.contentSource"
            :url="card.fields.url"
            :image-url="card.fields.image.fields.file.url"
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
    asyncData ({ params }) {
      // fetch the browsePage data, include set to 2 in order to get nested card data
      return contentfulClient.getEntry(params.slug, { 'include': 2 })
        .then((entry) => {
          return {
            page: entry.fields
          };
      });
    },
    components: {
      ContentCard
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
