<template>
  <div>
    <CookieDisclaimer />
    <a
      class="skip-main"
      href="#main"
      data-qa="main content accessibility link"
    >
      {{ $t('layout.skipToMain') }}
    </a>
    <PageHeader
      :enable-auto-suggest="enableAutoSuggest"
      :enable-language-selector="enableLanguageSelector"
      :enable-suggestion-validation="enableSuggestionValidation"
    />
    <main role="main">
      <b-container v-if="breadcrumbs">
        <b-row>
          <b-col class="col-12">
            <b-breadcrumb
              :items="breadcrumbs"
              class="px-0"
            />
          </b-col>
        </b-row>
      </b-container>
      <nuxt
        id="main"
      />
    </main>
    <PageFooter />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import PageHeader from '../components/PageHeader.vue';
  import PageFooter from '../components/PageFooter.vue';
  import CookieDisclaimer from '../components/generic/CookieDisclaimer';

  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-vue/dist/bootstrap-vue.css';

  export default {
    components: {
      PageHeader,
      PageFooter,
      CookieDisclaimer
    },

    computed: {
      ...mapGetters({
        canonicalUrl: 'http/canonicalUrl'
      }),
      enableAutoSuggest() {
        // Auto suggest on search form will be disabled unless toggled on by env var,
        // and always disabled on entity pages.
        return Boolean(Number(process.env['ENABLE_AUTOSUGGEST'])) && !(this.$store.state.entity && this.$store.state.entity.id);
      },
      enableLanguageSelector() {
        return Boolean(Number(process.env['ENABLE_LANGUAGE_SELECTOR']));
      },
      enableSuggestionValidation() {
        return Boolean(Number(process.env['ENABLE_ENTITY_SUGGESTION_RECORD_VALIDATION']));
      },
      breadcrumbs() {
        return this.$store.state.breadcrumb.data;
      }
    },

    head() {
      const i18nSeo = this.$nuxtI18nSeo();
      return {
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,700%7COpen+Sans:400italic,700italic,400,600,700&subset=latin,greek,cyrillic&display=swap', body: true },
          ...this.i18nLinksWithDefault(i18nSeo)
        ],
        htmlAttrs: {
          ...i18nSeo.htmlAttrs
        },
        meta: [
          { hid: 'description', property: 'description', content: 'Europeana' },
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl },
          ...i18nSeo.meta
        ]
      };
    },

    methods: {
      i18nLinksWithDefault(i18nSeo) {
        const defaultISO =  this.$i18n.isoLocale(this.$i18n.defaultLocale);
        const links = i18nSeo.link;
        const defaultLink = { hreflang: 'x-default', rel: 'alternate', href: links.find(link => link.hreflang === defaultISO).href };
        return [defaultLink, ...links];
      }
    }
  };
</script>
