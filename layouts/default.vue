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
    <main role="main">
      <nuxt
        id="main"
      />
    </main>
    <PageFooter />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import locales from '../plugins/i18n/locales';

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
      },

      hreflang() {
        const nuxtI18nSeo = this.$nuxtI18nSeo();
        const defaultLocale = this.$i18n.defaultLocale;
        const defaultIso =  locales.find(locale => locale.code === defaultLocale)['iso'];
        const filteredLinks = nuxtI18nSeo.link.map((lk) => {
          if (lk.hreflang === defaultIso) {
            return { ...lk, hreflang: 'x-default' };
          }
          return lk;
        });

        return {
          link: filteredLinks,
          meta: nuxtI18nSeo.meta,
          htmlAttrs: nuxtI18nSeo.htmlAttrs
        };
      }
    },

    head() {
      return {
        link: [
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,700%7COpen+Sans:400italic,700italic,400,600,700&subset=latin,greek,cyrillic&display=swap', body: true },
          ...this.hreflang.link
        ],
        htmlAttrs: {
          myAttribute: 'My Value',
          ...this.hreflang.htmlAttrs
        },
        meta: [
          { hid: 'description', property: 'description', content: 'Europeana' },
          { hid: 'og:url', property: 'og:url', content: this.canonicalUrl },
          ...this.hreflang.meta
        ]
      };
    }
  };
</script>

<style lang="scss">
  @import '~assets/scss/style';
</style>
