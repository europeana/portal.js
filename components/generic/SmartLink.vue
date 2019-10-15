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
    :class="[{ 'is-external-link' : isExternalLink }, linkClass]"
  >
    <slot />
    <span
      v-if="isExternalLink"
      class="sr-only"
    >
      ({{ $t('newWindow') }})
    </span>
  </b-link>
</template>

<script>
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

    data() {
      return {
        internalDomain: process.env.INTERNAL_LINK_DOMAIN
      };
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
        const path = this.destination;
        const hostnamePattern = /\/\/([^/:]+)/;

        if (typeof path !== 'string' || !hostnamePattern.test(path)) return false;

        const hostname = path.match(hostnamePattern)[1];
        return !hostname.endsWith(this.internalDomain);
      }
    }
  };
</script>
