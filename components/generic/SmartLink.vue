<template>
  <b-link
    v-if="useRouterLink"
    :to="path"
    :class="linkClass"
  >
    <slot />
  </b-link>
  <b-link
    v-else
    :href="path"
    :target="isExternalLink ? '_blank' : '_self'"
    :class="linkClass"
  >
    <slot />
    <b-img
      v-if="isExternalLink"
      src="../../assets/img/icons/link-external-white.svg"
      class="external-icon"
      :alt="$t('externalLink')"
    />
  </b-link>
</template>

<script>
  const parseDomain = require('parse-domain');

  export default {
    props: {
      destination: {
        type: [String, Object],
        default: ''
      },
      linkClass: {
        type: String,
        default: ''
      }
    },
    computed: {
      useRouterLink() {
        return (typeof this.destination !== 'string') || this.destination.startsWith('/');
      },
      path() {
        if (typeof this.destination === 'object') {
          return this.localePath(this.destination);
        }

        if (typeof this.destination === 'string' && this.destination.startsWith('/')) {
          return this.localePath({
            name: 'slug',
            params: {
              pathMatch: this.destination.replace(/^\//, '')
            }
          });
        }
        return this.destination;
      },
      isExternalLink() {
        return parseDomain(this.destination);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .external-icon {
    margin-left: .2rem;
    margin-bottom: .2rem;
  }
</style>
