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
    :class="[{ 'is-external-link' : isExternalLink && !hideExternalIcon }, linkClass]"
  >
    <slot /><!-- This comment removes white space which gets underlined
 --><span
      v-if="isExternalLink"
      class="sr-only"
    >
      ({{ $t('newWindow') }})
    </span>
  </b-link>
</template>

<script>
// TODO: refactor to use $link.to and $link.href

  export default {
    props: {
      destination: {
        type: [String, Object],
        default: ''
      },

      linkClass: {
        type: String,
        default: ''
      },

      hideExternalIcon: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        internalDomain: this.$config.app.internalLinkDomain
      };
    },

    computed: {
      useRouterLink() {
        return this.path && this.path.startsWith('/');
      },

      path() {
        if (typeof this.destination === 'object') {
          return this.$path(this.destination);
        }

        if (this.itemIdentifier) {
          return this.$path({
            name: 'item-all',
            params: { pathMatch: this.itemIdentifier.slice(1) }
          });
        }

        if (typeof this.destination === 'string' && this.destination.startsWith('/')) {
          return this.$path({
            name: 'slug',
            params: {
              pathMatch: this.destination.slice(1)
            }
          });
        }

        return this.destination;
      },

      itemIdentifier() {
        const itemUriPattern = /^http:\/\/data\.europeana\.eu\/item(\/.*)$/;
        if (itemUriPattern.test(this.destination)) {
          return this.destination.match(itemUriPattern)[1];
        }
        return null;
      },

      isExternalLink() {
        const path = this.destination;
        const hostnamePattern = /\/\/([^/:]+)/;

        if (this.itemIdentifier) {
          return false;
        }
        if (typeof path !== 'string' || !hostnamePattern.test(path)) {
          return false;
        }

        const hostname = path.match(hostnamePattern)[1];
        return !hostname.endsWith(this.internalDomain);
      }
    }
  };
</script>
