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
        if (!process.browser) return;

        const destDomain = parseDomain(this.destination);
        const currentDomain = parseDomain(window.location.href);

        return (destDomain && currentDomain) && (destDomain.domain + destDomain.tld !== currentDomain.domain + currentDomain.tld);
      }
    }
  };
</script>
