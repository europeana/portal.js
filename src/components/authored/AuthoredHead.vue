<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        class="col-lg-8 pt-large mb-4"
      >
        <article>
          <div class="title">
            <div
              v-if="contextLabel"
              class="context-label"
            >
              {{ contextLabel }}
            </div>
            <h2
              v-if="exhibitionTitle"
              class="subtitle mb-0"
            >
              {{ exhibitionTitle }}
            </h2>
            <h1 data-qa="title">
              {{ title }}
            </h1>
            <p
              v-if="description"
              class="lead"
            >
              {{ description }}
            </p>
          </div>
        </article>
      </b-col>
    </b-row>
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        class="col-lg-8"
      >
        <ImageWithAttribution
          v-if="heroImage"
          :src="heroImage.url"
          :content-type="heroImage.contentType"
          :rights-statement="hero.license"
          :attribution="hero"
          :alt="heroImageAlt"
          hero
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

  export default {
    name: 'AuthoredHead',

    components: {
      ImageWithAttribution: () => import('../../components/generic/ImageWithAttribution')
    },

    props: {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        default: ''
      },

      exhibitionTitle: {
        type: String,
        default: ''
      },

      hero: {
        type: Object,
        default: null
      },

      contextLabel: {
        type: String,
        default: null
      }
    },

    computed: {
      heroImage() {
        return this.hero ? this.hero.image : null;
      },
      heroImageAlt() {
        return this.heroImage && this.heroImage.description ? this.heroImage.description : '';
      }
    }
  };
</script>
