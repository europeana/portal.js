<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col
        cols="12"
        class="col-lg-8 mb-3 mb-lg-4"
      >
        <article>
          <div class="title">
            <div
              v-if="contextLabel"
              class="context-label mb-1"
              data-qa="context label"
            >
              {{ contextLabel }}
            </div>
            <h2
              v-if="exhibitionTitle"
              class="subtitle"
            >
              {{ exhibitionTitle }}
            </h2>
            <h1
              class="mb-2"
              data-qa="title"
            >
              {{ title }}
            </h1>
            <p
              v-if="subtitle || description"
              class="subtitle mb-2"
            >
              {{ subtitle || description }}
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
        <ImageWithAttributionContainer
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
      ImageWithAttributionContainer: () => import('../../components/image/ImageWithAttributionContainer')
    },

    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String,
        default: ''
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
        return this.heroImage?.description || '';
      }
    }
  };
</script>
