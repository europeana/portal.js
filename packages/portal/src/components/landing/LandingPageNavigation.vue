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
    name: 'LandingPageNavigation',

    components: {
      SmartLink
    },

    props: {
      links: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .nav-item {
    @media (min-width: $bp-large) {
      margin-left: 0.5rem;
    }

    @media (min-width: $bp-4k) {
      margin-left: 1rem;
    }

    .nav-link {
      color: $black;
      text-decoration: none;
      text-transform: uppercase;
      font-size: $font-size-extrasmall;
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
        padding: 1rem;
      }

      &:hover {
        color: $innovationblue;
      }
    }
  }
</style>
