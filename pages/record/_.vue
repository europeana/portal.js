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
        <div class="card p-3 mb-3">
          <div
            class="card-grid"
            :class="isRichMedia && 'card-grid-richmedia'"
          >
            <header
              v-if="titlesInCurrentLanguage"
              class="card-heading"
            >
              <template
                v-for="(heading, index) in titlesInCurrentLanguage"
              >
                <h1
                  v-if="index === 0"
                  :key="index"
                  :lang="heading.code"
                >
                  {{ heading.value }}
                </h1>
                <p
                  v-else
                  :key="index"
                  :lang="heading.code"
                  class="font-weight-bold"
                >
                  {{ heading.value }}
                </p>
              </template>
            </header>
            <MediaPresentation
              :codec-name="selectedMedia.edmCodecName"
              :image-link="image.link"
              :image-src="image.src"
              :mime-type="selectedMedia.ebucoreHasMimeType"
              :url="selectedMedia.about"
              :width="selectedMedia.ebucoreWidth"
              :height="selectedMedia.ebucoreHeight"
              class="mb-3"
            />
            <div
              v-if="descriptionInCurrentLanguage"
              class="description"
            >
              <div
                v-for="(value, index) in descriptionInCurrentLanguage.values"
                :key="index"
              >
                <!-- eslint-disable vue/no-v-html -->
                <p
                  :lang="descriptionInCurrentLanguage.code"
                  v-html="$options.filters.convertNewLine(value)"
                />
                <!-- eslint-disable vue/no-v-html -->
                <hr
                  v-if="(index + 1) < descriptionInCurrentLanguage.values.length"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="card p-3 mb-3">
          <MediaActionBar
            v-if="selectedMedia.about"
            :url="selectedMedia.about"
            :europeana-identifier="identifier"
          />
        </div>
        <div
          class="card p-3 mb-3"
          data-qa="main metadata section"
        >
          <MetadataField
            v-for="(value, name) in coreFields"
            :key="name"
            :name="name"
            :field-data="value"
            class="mb-3"
          />
        </div>
        <div class="card p-3">
          <MetadataField
            v-for="(value, name) in fields"
            :key="name"
            :name="name"
            :field-data="value"
            class="mb-3"
          />
        </div>
      </b-col>
      <b-col
        cols="12"
        lg="3"
      >
        <EntityCards
          v-if="relatedEntities"
          :entities="relatedEntities"
          data-qa="related entities"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import EntityCards from '../../components/entity/EntityCards';
  import MediaActionBar from '../../components/record/MediaActionBar';
  import AlertMessage from '../../components/generic/AlertMessage';
  import MetadataField from '../../components/record/MetadataField';
  import MediaPresentation from '../../components/record/MediaPresentation';

  import getRecord from '../../plugins/europeana/record';
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import { isRichMedia } from '../../plugins/media.js';
  import { searchEntities } from '../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage,
      EntityCards,
      MediaActionBar,
      MetadataField,
      MediaPresentation
    },
    data() {
      return {
        agents: null,
        altTitle: null,
        concepts: null,
        description: null,
        error: null,
        coreFields: null,
        fields: null,
        identifier: null,
        image: null,
        media: null,
        relatedEntities: [],
        title: null
      };
    },
    computed: {
      europeanaAgents() {
        return (this.agents || []).filter((agent) => agent.about.startsWith('http://data.europeana.eu/agent/'));
      },
      europeanaConcepts() {
        return (this.concepts || []).filter((concept) => concept.about.startsWith('http://data.europeana.eu/concept/'));
      },
      europeanaEntityUris() {
        const entities = this.europeanaConcepts.concat(this.europeanaAgents);
        return entities.map((entity) => entity.about).slice(0, 5);
      },
      titlesInCurrentLanguage() {
        let titles = [];

        const mainTitle = this.title ? langMapValueForLocale(this.title, this.$i18n.locale) : '';
        const alternativeTitle = this.altTitle ? langMapValueForLocale(this.altTitle, this.$i18n.locale) : '';

        const allTitles = [].concat(mainTitle, alternativeTitle).filter(Boolean);
        for (let title of allTitles) {
          for (let value of title.values) {
            titles.push({ 'code': title.code, value });
          }
        }

        return titles;
      },
      descriptionInCurrentLanguage() {
        if (!this.description) {
          return false;
        }
        return langMapValueForLocale(this.description, this.$i18n.locale);
      },
      isRichMedia() {
        return isRichMedia(this.selectedMedia.ebucoreHasMimeType, this.selectedMedia.edmCodecName, this.selectedMedia.about);
      },
      selectedMedia() {
        return this.media[0] || {};
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
    async mounted() {
      this.relatedEntities = await searchEntities(this.europeanaEntityUris, { wskey: process.env.EUROPEANA_ENTITY_API_KEY });
    },
    head() {
      return {
        title: this.titlesInCurrentLanguage[0] ? this.titlesInCurrentLanguage[0].value : this.$t('record')
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .card-grid {
    display: grid;
    column-gap: 1rem;
    grid-template-columns: [col1-start] 1fr [col2-start] 1fr [col2-end];
    grid-template-rows: [row1-start] auto [row2-start] auto [row3-start] auto [row3-end];
  }

  .card-heading {
    grid-row: row1-start;
    grid-column: col1-start/col2-end;

    @media (min-width: $bp-large) {
      grid-column: col2-start/col2-end;
    }
  }

  .media-presentation {
    grid-row: row3-start;
    grid-column: col1-start/col2-end;

    @media (min-width: $bp-large) {
      grid-column: col1-start/col2-start;
      grid-row: row1-start/row3-end;
    }
  }

  .description {
    grid-column: col1-start/col2-end;
    grid-row: row2-start;

    @media (min-width: $bp-large) {
      grid-column: col2-start/col2-end;
    }
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
