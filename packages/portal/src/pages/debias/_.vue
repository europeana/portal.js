<template>
  <div
    class="page text-page"
    data-qa="debias term page"
  >
    <LoadingSpinner
      v-if="$fetchState.pending"
      class="flex-md-row py-4 text-center"
    />
    <ErrorMessage
      v-else-if="$fetchState.error"
      data-qa="error message container"
      :error="$fetchState.error"
    />
    <template v-else>
      <b-container
        class="footer-margin"
      >
        <b-row class="justify-content-center">
          <b-col
            cols="12"
            class="col-lg-8"
          >
            <template v-if="term">
              <article>
                <h1><q>{{ title }}</q></h1>
                <p
                  v-for="(definition, index) of term.definition?.[$i18n.locale]"
                  :key="`definition-${index}`"
                >
                  {{ definition }}
                </p>
                <h2 v-if="term.note?.[$i18n.locale]">
                  {{ $t('debias.headings.source') }}
                </h2>
                <p
                  v-for="(note, index) of term.note?.[$i18n.locale]"
                  :key="`note-${index}`"
                >
                  {{ note }}
                </p>
                <h2 v-if="term.scopeNote?.[$i18n.locale]">
                  {{ $t('debias.headings.recommendations') }}
                </h2>
                <p
                  v-for="(scopeNote, index) of term.scopeNote?.[$i18n.locale]"
                  :key="`scopeNote-${index}`"
                >
                  {{ scopeNote }}
                </p>
                <h2 v-if="altLabel">
                  {{ $t('debias.headings.alternatives') }}
                </h2>
                <p>
                  {{ altLabel }}
                </p>
              </article>
              <aside>
                <ImageOptimised
                  v-if="logo"
                  :src="logo.url"
                  :width="logo.width"
                  :height="logo.height"
                  :content-type="logo.contentType"
                  :contentful-image-crop-presets="imageCropPresets"
                  :image-sizes="imageSizes"
                />
                <b-row>
                  <b-col
                    cols="12"
                    class="col-lg-10"
                  >
                    <hr>
                    <i18n
                      path="debias.background.text"
                      tag="p"
                      class="font-italic"
                    >
                      <template #link>
                        <a href="https://pro.europeana.eu/project/de-bias">{{ $t('debias.background.link') }}</a>
                      </template>
                    </i18n>
                  </b-col>
                </b-row>
              </aside>
            </template>
            <p v-else>
              {{ $t('debias.termNotFound') }}
            </p>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </div>
</template>

<script>
  import browseStaticPageGraphql from '@/graphql/queries/browseStaticPage.graphql';
  import pageMetaMixin from '@/mixins/pageMeta';
  import ImageOptimised from '@/components/image/ImageOptimised.vue';
  import { IMAGE_CONTAINER_PRESETS as imageCropPresets, IMAGE_CONTAINER_SIZES as imageSizes } from '@/utils/contentful/imageCropPresets';

  export default {
    name: 'DeBiasPage',
    components: {
      ErrorMessage: () => import('@/components/error/ErrorMessage'),
      ImageOptimised,
      LoadingSpinner: () => import('@/components/generic/LoadingSpinner')
    },
    mixins: [
      pageMetaMixin
    ],
    data() {
      return {
        imageCropPresets,
        imageSizes,
        logo: null,
        term: null
      };
    },
    async fetch() {
      const variables = {
        identifier: 'debias',
        locale: this.$i18n.localeProperties.iso,
        preview: this.$route.query.mode === 'preview'
      };

      try {
        // Request Debias static page to retrieve logo image
        const response = await this.$contentful.query(browseStaticPageGraphql, variables);
        this.logo = response.data.staticPageCollection.items[0]?.image;

        const annotations = await this.$apis.annotation.search({
          query: `body_uri:"${this.id}"`,
          pageSize: 1,
          profile: 'dereference'
        });

        this.term = annotations?.[0]?.body || null;
      } catch (e) {
        this.$error(e, { scope: 'page' });
      }
    },
    computed: {
      altLabel() {
        return this.term.altLabel?.[this.$i18n.locale].join('; ');
      },
      id() {
        const idNum = this.$route.params.pathMatch.split('-').shift();

        return `https://rnd-2.eanadev.org/share/debias/vocabulary/c_${idNum}_${this.$i18n.locale}.xml`;
      },

      title() {
        return this.term?.prefLabel[this.$i18n.locale] || this.$i18n.t('messages.notFound');
      },

      pageMeta() {
        return {
          title: this.title,
          description: this.term?.definition?.[this.$i18n.locale]?.[0],
          ogType: 'article'
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

h1 {
  margin-bottom: 1rem;

  @media (min-width: $bp-small) {
    margin-bottom: 2rem;
  }
}

// Override quotation style for English only
:lang(en) h1 q {
  quotes: '‘' '’';
}

h2 {
  margin-bottom: 1rem;
  margin-top: 1.5rem;

  @media (min-width: $bp-small) {
    margin-top: 2.625rem;
    margin-bottom: 1rem;
  }
}
aside {
  margin-top: 1.5rem;

  @media (min-width: $bp-small) {
    font-size: 1.125rem;
    margin-top: 2.625rem;
  }

  @media (min-width: $bp-medium) {
    margin-left: -1rem;
    margin-right: -1rem;
  }

  @media (min-width: $bp-large) {
    margin-left: -3rem;
    margin-right: -3rem;
  }
}
</style>
