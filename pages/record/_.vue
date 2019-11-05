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
            <div
              v-if="descriptionInCurrentLanguage"
              class="description"
            >
              <div
                v-for="(value, index) in descriptionInCurrentLanguage.value"
                :key="index"
              >
                <!-- eslint-disable vue/no-v-html -->
                <p
                  :lang="descriptionInCurrentLanguage.code"
                  v-html="$options.filters.convertNewLine(value)"
                />
                <!-- eslint-disable vue/no-v-html -->
                <hr
                  v-if="(index + 1) < descriptionInCurrentLanguage.value.length"
                >
              </div>
            </div>
          </div>
        </div>
        <div class="card p-3 mb-3">
          <MediaActionBar
            v-if="selectedMedia"
            :url="selectedMedia.about"
            :europeana-identifier="identifier"
          />
        </div>
        <div
          class="card p-3 mb-3"
          data-qa="Main metadata"
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
        style="background-color: #FFF"
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
  import MediaActionBar from '../../components/record/MediaActionBar';
  import AlertMessage from '../../components/generic/AlertMessage';
  import WebResources from '../../components/record/WebResources';
  import MetadataField from '../../components/record/MetadataField';
  import MediaPresentation from '../../components/record/MediaPresentation';

  import getRecord from '../../plugins/europeana/record';
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import { isRichMedia } from '../../plugins/media.js';
  import { searchEntities } from '../../plugins/europeana/entity';

  export default {
    components: {
      MediaActionBar,
      AlertMessage,
      WebResources,
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
        identifier: null,
        image: null,
        fields: null,
        media: null,
        relatedEntities: null,
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
