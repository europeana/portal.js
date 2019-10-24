<template>
  <b-container v-if="error">
    <AlertMessage
      :error="error"
    />
  </b-container>
  <b-container
    v-else
    data-qa="record page"
    class="mt-5"
  >
    <b-row class="mb-3">
      <b-col
        cols="12"
        lg="9"
      >
        <div class="card p-3">
          <div class="card-grid">
            <h1
              v-if="title"
            >
              {{ title | inCurrentLanguage($i18n.locale) }}
            </h1>
            <MediaPresentation
              :codec-name="edmIsShownBy.edmCodecName"
              :image-link="image.link"
              :image-src="image.src"
              :mime-type="edmIsShownBy.ebucoreHasMimeType"
              :url="edmIsShownBy.about"
              :width="edmIsShownBy.ebucoreWidth"
              :height="edmIsShownBy.ebucoreHeight"
              class="mb-3"
            />
            <p
              v-if="description"
              class="description"
            >
              {{ description | inCurrentLanguage($i18n.locale) }}
            </p>
          </div>
          <MetadataField
            v-for="(value, name) in fields"
            :key="name"
            :name="name"
            :value="value"
            class="mb-3"
          />
        </div>
      </b-col>
      <b-col
        cols="12"
        lg="3"
      >
        <!-- TODO: add related entities / EC-3716 -->
        Placeholder for related entities
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col>
        <h2>Media</h2>
        <WebResources
          :media="media"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';
  import WebResources from '../../components/record/WebResources';
  import MetadataField from '../../components/record/MetadataField';
  import MediaPresentation from '../../components/record/MediaPresentation';

  import getRecord from '../../plugins/europeana/record';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaPresentation
    },
    data() {
      return {
        description: null,
        error: null,
        image: null,
        fields: null,
        media: null,
        title: null,
        edmIsShownBy: {}
      };
    },
    asyncData({ env, params, res, app, redirect }) {
      if (env.RECORD_PAGE_REDIRECT_PATH) {
        return redirect(app.localePath({ path: env.RECORD_PAGE_REDIRECT_PATH }));
      }

      return getRecord(`/${params.pathMatch}`, {
        wskey: env.EUROPEANA_API_KEY
      })
        .then((result) => {
          return result.record;
        })
        .catch((error) => {
          if (typeof res !== 'undefined') {
            res.statusCode = (typeof error.statusCode !== 'undefined') ? error.statusCode : 500;
          }
          return { error: error.message };
        });
    },
    head() {
      return {
        title: this.title && this.$options.filters.inCurrentLanguage(this.title, this.$i18n.locale) ? this.$options.filters.inCurrentLanguage(this.title, this.$i18n.locale) : this.$t('record')
      };
    }
  };
</script>

<style>
  /* TODO: introduced grid as preparition for EC-3782, update accordingly */
  .card-grid {
    display: grid;
    column-gap: 1rem;
    grid-template-columns: [col1-start] 1fr [col2-start] 1fr [col2-end];
    grid-template-rows: [row1-start] auto [row2-start] auto [row3-start] auto [row3-end] ;
  }

  h1 {
    grid-column: col1-start/col2-end;
    grid-row: row1-start;
  }

  .media-presentation {
    grid-column: col1-start/col2-end;
    grid-row: row2-start;
  }

  .description {
    grid-column: col1-start/col2-end;
    grid-row: row3-start;
  }
</style>
