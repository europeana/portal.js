<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ page.fields.pageTitle }}
      </h1>

      <p>{{ page.fields.pageDescription }}</p>

      <div
        v-for="section in page.fields.section"
        :key="section.sys.id"
        class="banner"
      >
        <h2>{{ section.fields.description }}</h2>
        <ul>
          <ContentCard
            v-for="card in section.fields.contentCards"
            :key="card.sys.id"
            :card-title="card.fields.cardTitle"
            :content-source="card.fields.contentSource"
            :url="card.fields.url"
            :image-url="card.fields.image.fields.file.url"
          />
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import ContentCard from '~/components/ContentCard.vue';
import {createClient} from '~/plugins/contentful.js';

const contentfulClient = createClient();

export default {
  asyncData: function ({params}) {
    return Promise.all([
      // fetch the browsePage data
      contentfulClient.getEntry(params.slug, { 'include': 2 }) // this retrieves nested/linked resources like cards and their images
    ]).then(([entry]) => {
      // return data that should be available
      // in the template
      return {
        page: entry
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
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
