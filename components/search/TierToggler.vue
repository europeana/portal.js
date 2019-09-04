<template>
  <div>
    <p class="font-italic mb-5">
      {{ toggleText }}
      <b-link
        :to="togglePath"
        :event="''"
        class="toggle-link"
        data-qa="tier toggle button"
        @click="toggleHandler"
      >
        {{ !active ? button.show : button.hide }}.
      </b-link>
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
        // and resets the page to page 1, as the results will potentially change.
        // Used when users right click on link and `open new tab`.
        const currentRoute = this.$route;
        const qf = currentRoute.query.qf ? [].concat(currentRoute.query.qf) : [];
        const contentTierAll = 'contentTier:*';

        if (qf && qf.includes(contentTierAll)) {
          return {
            path: this.$route.fullPath,
            query: {
              qf: qf.filter(i => i !== contentTierAll),
              page: 1
            }
          };
        }

        qf.push(contentTierAll);
        return { path: this.$route.fullPath, query: { qf } };
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

  .toggle-link {
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
</style>
