<template>
  <b-navbar-nav
    data-qa="main navigation"
  >
    <li
      v-for="(link, index) in links"
      :key="index"
      class="nav-item"
    >
      <SmartLink
        :destination="link.url"
        link-class="nav-link btn btn-light-flat"
        exact
      >
        {{ link.text }}
      </SmartLink>
    </li>
  </b-navbar-nav>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';

  export default {
    name: 'DS4CHPageNavigation',

    components: {
      SmartLink
    },

    computed: {
      links() {
        return [
          { url: '#about-the-data-space', text: this.$t('ds4ch.header.navigation.about') },
          { url: '#consortium-partners', text: this.$t('ds4ch.header.navigation.partners') },
          { url: '#explore-the-data-offer', text: this.$t('ds4ch.header.navigation.explore') }
        ];
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/DS4CH/variables';

  .nav-item {
    @media (min-width: $bp-large) {
      margin-left: 0.5rem;
    }

    @media (min-width: $bp-4k) {
      margin-left: 1rem;
    }

    .nav-link {
      text-transform: uppercase;
      font-family: $font-family-montserrat;
      font-size: $font-size-extrasmall;
      letter-spacing: 0.6px;
      font-weight: 600;
      text-align: left;
      padding-top: 1rem;
      padding-bottom: 1rem;

      @media (min-width: $bp-large) {
        text-align: center;
        padding: 0.5rem;
      }

      @media (min-width: $bp-4k) {
        font-size: $font-size-large;
        letter-spacing: 1.2px;
        padding: 1rem;
      }
    }
  }
</style>
