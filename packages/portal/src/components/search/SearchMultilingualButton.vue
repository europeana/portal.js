<template>
  <div>
    <b-button
      class="search-multilingual-button p-0 mr-2"
      :pressed="selected"
      variant="light-flat"
      :aria-label="ariaLabelText"
      @click="toggle"
    >
      <span
        :class="{
          'icon-translate': selected,
          'icon-translate-outlined': !selected
        }"
      />
    </b-button>
  </div>
</template>

<script>
  export default {
    name: 'SearchMultilingualButton',

    data() {
      return {
        selected: Boolean(this.$auth.loggedIn && this.$route.query.multilingual) || false
      };
    },

    computed: {
      ariaLabelText() {
        return this.selected ? this.$t('search.multilingual.disable') : this.$t('search.multilingual.enable');
      }
    },

    mounted() {
      // after successful login redirect, enable multilingual search and clean up URL
      if (this.selected && this.$auth.loggedIn) {
        this.$emit('toggleMultilingual', this.selected);
        this.$router.replace({ query: { ...this.$route.query, multilingual: undefined } });
      }
    },

    methods: {
      toggle() {
        if (this.$auth.loggedIn) {
          this.selected = !this.selected;
          this.$emit('toggleMultilingual', this.selected);
        } else {
          const redirect = this.getFullPathWithMultilingualParam();
          this.$router.push(this.localePath({ name: 'account-login', query: { redirect } }));
        }
      },
      getFullPathWithMultilingualParam() {
        const baseUrl = this.$config.app.baseUrl;
        const currentUrl = new URL(this.$route.fullPath, baseUrl);
        currentUrl.searchParams.set('multilingual', true);
        const fullPath = currentUrl.href.replace(baseUrl, '');
        return fullPath;
      }
    }
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  .search-multilingual-button {
    font-size: $font-size-large;
    line-height: 1;

    @media (min-width: $bp-4k) {
      font-size: $font-size-large-4k;
    }

    &:hover {
      color: $black;

      .icon-translate:before {
        content: '\e93c';
      }
      .icon-translate-outlined:before {
        content: '\e970';
      }
    }
  }

</style>
