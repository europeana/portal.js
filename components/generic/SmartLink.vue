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
        const destDomain = parseDomain(this.destination);
        if (destDomain === null) {
          return false;
        }
        const dest = [destDomain.domain, destDomain.tld].join('.');
        const currentDomain = this.$store.state.request.domain;
        const current = currentDomain;
        return dest !== current;
      }
    }
  };
</script>
