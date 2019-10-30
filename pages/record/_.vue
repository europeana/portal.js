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
          <div
            class="card-grid"
            :class="isRichMedia && 'card-grid-richmedia'"
          >
            <div class="card-heading">
              <h1
                v-if="titlesInCurrentLanguage.mainTitle"
                :lang="titlesInCurrentLanguage.mainTitle.code"
              >
                {{ titlesInCurrentLanguage.mainTitle.value }}
              </h1>
              <!-- eslint-disable vue/no-v-html -->
              <p
                v-if="titlesInCurrentLanguage.altTitle"
                :lang="titlesInCurrentLanguage.altTitle.code"
                class="font-weight-bold"
                v-html="titlesInCurrentLanguage.altTitle.value"
              />
              <!-- eslint-disable vue/no-v-html -->
            </div>
            <MediaPresentation
              v-if="selectedMedia"
              :codec-name="selectedMedia.edmCodecName"
              :image-link="image.link"
              :image-src="image.src"
              :mime-type="selectedMedia.ebucoreHasMimeType"
              :url="selectedMedia.about"
              :width="selectedMedia.ebucoreWidth"
              :height="selectedMedia.ebucoreHeight"
              class="mb-3"
            />
            <!-- eslint-disable vue/no-v-html -->
            <p
              v-if="descriptionInCurrentLanguage"
              class="description"
              :lang="descriptionInCurrentLanguage.code"
              v-html="descriptionInCurrentLanguage.value"
            />
            <!-- eslint-disable vue/no-v-html -->
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
      <!-- TODO: remove when the carousel has come to town. -->
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
  import { isRichMedia } from '../../plugins/media.js';

  export default {
    components: {
      AlertMessage,
      WebResources,
      MetadataField,
      MediaPresentation
    },
    data() {
      return {
        altTitle: null,
        description: null,
        error: null,
        image: null,
        fields: null,
        media: null,
        title: null,
        edmIsShownBy: {}
      };
    },
    computed: {
      titlesInCurrentLanguage() {
        const title = this.title ? this.$options.filters.inCurrentLanguage(this.title, this.$i18n.locale) : '';
        const alternativeTitle = this.altTitle ? this.$options.filters.inCurrentLanguage(this.altTitle, this.$i18n.locale) : '';

        if (title && alternativeTitle) {
          return { 'mainTitle': title, 'altTitle': alternativeTitle };
        } else if (title && !alternativeTitle) {
          return { 'mainTitle': title };
        } else if (!title && alternativeTitle) {
          return { 'mainTitle': alternativeTitle };
        } else {
          return false;
        }
      },
      descriptionInCurrentLanguage() {
        if (!this.description) {
          return false;
        }
        return this.$options.filters.inCurrentLanguage(this.description, this.$i18n.locale);
      },
      isRichMedia() {
        return isRichMedia(this.edmIsShownBy.ebucoreHasMimeType, this.edmIsShownBy.edmCodecName, this.edmIsShownBy.about);
      },
      selectedMedia() {
        return this.media[0];
      }
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
        title: this.titleInCurrentLanguage ? this.titleInCurrentLanguage.value : this.$t('record')
      };
    }
  };
</script>

<style>
  .card-grid {
    display: grid;
    column-gap: 1rem;
    grid-template-columns: [col1-start] 1fr [col2-start] 1fr [col2-end];
    grid-template-rows: [row1-start] auto [row2-start] auto [row3-start] auto [row3-end];
  }

  .card-heading {
    grid-column: col2-start/col2-end;
    grid-row: row1-start;
  }

  .media-presentation {
    grid-column: col1-start/col2-start;
    grid-row: row1-start/row3-end;
  }

  .description {
    grid-column: col2-start/col2-end;
    grid-row: row2-start;
  }

  .card-grid-richmedia .card-heading {
    grid-column: col1-start/col2-end;
  }

  .card-grid-richmedia .media-presentation {
    grid-column: col1-start/col2-end;
    grid-row: row2-start;
  }

  .card-grid-richmedia .description {
    grid-column: col1-start/col2-end;
    grid-row: row3-start;
  }
</style>
