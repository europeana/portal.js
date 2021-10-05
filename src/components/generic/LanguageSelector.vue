<template>
  <b-dropdown
    variant="light"
    toggle-class="text-decoration-none"
  >
    <template slot="button-content">
      {{ selectedLocale.name }}
    </template>

    <template test>
      <b-dropdown-item
        v-for="locale in availableLocales"
        :key="locale.code"
        :to="$path({ ...$route, params: { ...$route.params, locale: locale.code } })"
        :data-qa="`${locale.name} language option`"
      >
        {{ locale.name }}
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>

<script>
  import locales from '@/mixins/locales';
  export default {
    name: 'LangSelector',
    mixins: [
      locales
    ],

    head() {
      return {
        htmlAttrs: {
          lang: this.$i18n.locale
        }
      };
    }
  };
</script>
