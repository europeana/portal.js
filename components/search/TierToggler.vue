<template>
  <div>
    <p class="font-italic">
      {{ toggleText }}
      <nuxt-link
        :to="togglePath"
        class="toggle-button"
        data-qa="tier toggle button"
        @click.native="toggleHandler"
      >
        {{ !active ? button.show : button.hide }}.
      </nuxt-link>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'TierToggler',

    props: {
      activeState: {
        type: Boolean,
        default: null
      }
    },

    data() {
      return {
        active: false,
        button: {
          show: this.$t('searchTier.button.show'),
          hide: this.$t('searchTier.button.hide')
        },
        text: {
          show: this.$t('searchTier.text.show'),
          hide: this.$t('searchTier.text.hide')
        }
      };
    },

    computed: {
      toggleText() {
        if (this.active) {
          return this.text.hide;
        }
        return this.text.show;
      },

      togglePath() {
        // Adds or removes `contentTier:*` from toggle path
        // Used when users right click on link and `open new tab`.
        const currentRoute = this.$route;
        const qf = currentRoute.query.qf ? [].concat(currentRoute.query.qf) : [];
        const contentTierAll = 'contentTier:*';

        if (qf && qf.includes(contentTierAll)) {
          const removeContentTier = qf.filter(i => i !== contentTierAll);

          return { path: this.$route.fullPath, query: { qf: removeContentTier } };
        }
        return { path: this.$route.fullPath, query: { qf: contentTierAll } };
      }
    },

    mounted() {
      if (this.activeState) {
        this.active = this.activeState;
      }
    },

    methods: {
      toggleHandler() {
        if (!this.active) {
          this.$emit('toggle', 'contentTier', ['*']);
          this.active = true;
        } else {
          this.$emit('toggle', 'contentTier', []);
          this.active = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .toggle-button {
    padding: 0;
    font-style: italic;
    height: auto;
    vertical-align: baseline;
    background: transparent;
    border: 0;
    box-shadow: none;
    color: $textcolor-coloured;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
</style>
