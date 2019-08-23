<template>
  <div>
    <p class="font-italic">
      {{ toggleText }}
      <button
        class="toggle-button"
        data-qa="tier toggler"
        @click="toggleHandler"
      >
        {{ !toggle ? button.show : button.hide }}
      </button>.
    </p>
  </div>
</template>

<script>
  export default {
    name: 'TierToggler',

    props: {
      toggled: {
        type: Boolean,
        default: false
      },
      text: {
        type: Object,
        required: true
      },
      button: {
        type: Object,
        required: true
      },
      queryKey: {
        type: String,
        default: 'tier_zero'
      }
    },

    data () {
      return {
        toggle: this.toggled
      };
    },

    computed: {
      toggleText () {
        if (this.toggle) {
          return this.text.hide;
        }
        return this.text.show;
      }
    },

    methods: {
      toggleHandler () {
        const query = this.$route.query;
        const qf = query.qf;
        const allTiers = 'contentTier:*';
        const clonedQuery = Object.assign({}, query);
        let qfArray = qf ? [].concat(qf) : [];

        if (!this.toggle) {
          qfArray.push(allTiers);
          clonedQuery.qf = qfArray;
          this.$router.push({
            query: clonedQuery
          });
          this.toggle = true;
        } else {
          qfArray = qfArray.filter(item => item !== allTiers);
          clonedQuery.qf = qfArray;
          this.$router.push({
            query: clonedQuery
          });
          this.toggle = false;
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
