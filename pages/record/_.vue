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
        <div class="card px-3 pt-3 mb-3">
          <div
            class="card-grid"
            :class="cardGridClass"
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
              :image-link="selectedMediaImage.link"
              :image-src="selectedMediaImage.src"
              :mime-type="selectedMedia.ebucoreHasMimeType"
              :url="selectedMedia.about"
              :width="selectedMedia.ebucoreWidth"
              :height="selectedMedia.ebucoreHeight"
              class="mb-3"
            />
            <MediaThumbnailGrid
              v-if="displayMediaThumbnailGrid"
              :media="media"
              :selected="selectedMedia.about"
              @select="selectMedia"
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
        <div class="card p-3 mb-3 bg-grey">
          <MediaActionBar
            :url="selectedMedia.about"
            :europeana-identifier="identifier"
            :rights-statement="rightsStatement"
          />
        </div>
        <div
          class="card px-3 pt-3 mb-5 meta-data"
          data-qa="main metadata section"
        >
          <MetadataField
            v-for="(value, name) in coreFields"
            :key="name"
            :name="name"
            :field-data="value"
          />
        </div>
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h2
              class="mb-3"
            >
              {{ $t('record.extendedInformation') }}
            </h2>
            <b-button
              v-b-toggle.extended-metadata
              variant="outline-primary"
              class="mb-3 d-inline extended-toggle p-0"
              @click="toggleExtendedMetadataPreference"
            >
              <span class="extended-opened">{{ $t('record.hideAll') }}</span>
              <span class="extended-closed">{{ $t('record.showAll') }}</span>
            </b-button>
          </div>
          <b-collapse id="extended-metadata">
            <MetadataField
              v-for="(value, name) in fields"
              :key="name"
              :name="name"
              :field-data="value"
              class="mb-3"
            />
          </b-collapse>
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
  import AlertMessage from '../../components/generic/AlertMessage';
  import EntityCards from '../../components/entity/EntityCards';
  import MediaActionBar from '../../components/record/MediaActionBar';
  import MediaPresentation from '../../components/record/MediaPresentation';
  import MediaThumbnailGrid from '../../components/record/MediaThumbnailGrid';
  import MetadataField from '../../components/record/MetadataField';

  import getRecord from '../../plugins/europeana/record';
  import { isRichMedia } from '../../plugins/media';
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import { searchEntities } from '../../plugins/europeana/entity';

  export default {
    components: {
      AlertMessage,
      EntityCards,
      MediaActionBar,
      MediaPresentation,
      MediaThumbnailGrid,
      MetadataField
    },

    data() {
      return {
        agents: null,
        altTitle: null,
        cardGridClass: null,
        concepts: null,
        description: null,
        error: null,
        coreFields: null,
        fields: null,
        identifier: null,
        isShownAt: null,
        media: [],
        relatedEntities: [],
        selectedMediaItem: null,
        title: null,
        type: null
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
      selectedMedia: {
        get() {
          return this.selectedMediaItem || this.media[0] || {};
        },
        set(about) {
          this.selectedMediaItem = this.media.find((item) => item.about === about) || {};
        }
      },
      selectedMediaImage() {
        return {
          src: this.selectedMedia.thumbnails.large,
          link: this.isShownAt
        };
      },
      displayMediaThumbnailGrid() {
        return Boolean(Number(process.env.ENABLE_RECORD_MEDIA_THUMBNAIL_GRID)) && (this.media.length > 1);
      },
      edmRights() {
        return this.selectedMedia.webResourceEdmRights ? this.selectedMedia.webResourceEdmRights : this.fields.edmRights;
      },
      rightsStatement() {
        if (this.edmRights) return langMapValueForLocale(this.edmRights, this.$i18n.locale).values[0];
        return false;
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
      this.cardGridClass = this.isRichMedia && 'card-grid-richmedia';
      this.relatedEntities = await searchEntities(this.europeanaEntityUris, { wskey: process.env.EUROPEANA_ENTITY_API_KEY });

      if (process.browser) {
        if (localStorage.itemShowExtendedMetadata && JSON.parse(localStorage.itemShowExtendedMetadata)) {
          this.$root.$emit('bv::toggle::collapse', 'extended-metadata');
        }
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      },

      toggleExtendedMetadataPreference() {
        if (process.browser) {
          localStorage.itemShowExtendedMetadata = localStorage.itemShowExtendedMetadata ? !JSON.parse(localStorage.itemShowExtendedMetadata) : true;
        }
      }
    },

    head() {
      return {
        title: this.titlesInCurrentLanguage[0] ? this.titlesInCurrentLanguage[0].value : this.$t('record.record')
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";
  @import "./assets/scss/icons.scss";

  h2 { // TODO: should this be the default sizing/styling of the h2, or just on this page?
    font-size: $font-size-medium;
    font-weight: bold;
  }

  .bg-grey {
    background-color: rgba(255, 255, 255, 0.5);
  }

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

  .meta-data {
    > div:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  .collapsed > .extended-opened,
  :not(.collapsed) > .extended-closed {
    display: none;
  }

  .extended-toggle {
    border: 0;
    color: $black;

    span {
      align-items: center;
      display: flex;

      &:after {
        content: '\e906';
        border: 1px solid $black;
        display: inline-block;
        font-size: 0.5rem;
        height: 1rem;
        line-height: 1rem;
        margin-left: 1rem;
        text-align: center;
        width: 1rem;
        @extend .icon-font;
      }

      &.extended-closed:after {
        content: '\e907';
      }
    }

    &:hover {
      background: transparent;
      color: $blue;

      span:after {
        border-color: $blue;
      }
    }
  }
</style>
