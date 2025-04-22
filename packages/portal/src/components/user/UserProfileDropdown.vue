<template>
  <b-dropdown
    boundary="window"
    :toggle-attrs="{ 'aria-label': ariaLabelToggle}"
    @show="menuOpen = true"
    @hide="menuOpen= false"
  >
    <b-dropdown-item
      v-for="item, index in links"
      :key="index"
      :href="item.url"
    >
      {{ item.text }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    name: 'UserProfileDropdown',

    data() {
      return {
        links: [{
          text: this.$t('account.accountManagement'),
          url: this.$keycloak?.accountUrl()
        }, this.$features.manageApiKeys && {
          text: this.$t('account.manageApiKeys'),
          url: 'account/api-keys'
        }, {
          text: this.$t('account.linkLogout'),
          url: '/account/logout'
        }].filter(Boolean),
        menuOpen: false
      };
    },

    computed: {
      ariaLabelToggle() {
        return this.menuOpen ? this.$t('account.menu.close') : this.$t('account.menu.open');
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  ::v-deep .dropdown-toggle {
    border-radius: 50%;
    padding: 0.25rem;
    line-height: 1.25rem;
    margin-left: 0.5rem;

    @media (min-width: $bp-4k) {
      padding: 0.625rem;
    }

    &:after {
      font-size: 0.5rem;
      width: 1.25rem;
      margin: 0;

      @media (min-width: $bp-4k) {
        font-size: 0.75rem;
        width: 1.25rem;
      }
    }

  }

  .show > ::v-deep .btn-secondary.dropdown-toggle {
    color: $darkgrey;
    background: $offwhite;
    border-color: $offwhite;
    border-radius: 50%;

    &:hover {
      color: $blue;
    }

    &:after {
      transform: rotateX(180deg);
    }
  }
</style>
