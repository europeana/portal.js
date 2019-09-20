<template>
  <div>
    <p class="font-italic mb-5">
      {{ toggleText }}
      <b-link
        :to="togglePath"
        class="toggle-link"
        data-qa="tier toggle"
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
        default: false
      }
    },

    data() {
      return {
        active: this.activeState,
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
        const contentTierAll = 'contentTier:*';

        let qf = currentRoute.query.qf ? [].concat(currentRoute.query.qf) : [];
        if (qf.includes(contentTierAll)) {
          qf = qf.filter(i => i !== contentTierAll);
        } else {
          qf.push(contentTierAll);
        }

        return { path: this.$route.fullPath, query: { qf, page: 1 } };
      }
    },

    methods: {
      toggleHandler() {
        this.active = !this.active;
        this.$emit('changed');
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
