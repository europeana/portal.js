<template>
  <div>
    <p class="font-italic">
      {{ toggleText }}
      <b-button
        variant="link"
        class="toggle-button"
        @click="toggleHandler"
      >
        {{ !toggle ? button.show : button.hide }}
      </b-button>.
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
        if (!this.toggle) {
          this.toggle = true;
          this.$router.push({
            query: Object.assign({}, this.$route.query, {
              [this.queryKey]: true
            })
          });
        } else {
          this.toggle = false;
          this.$router.push({
            query: Object.assign({}, this.$route.query, {
              [this.queryKey]: false
            })
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .toggle-button {
    padding: 0;
    font-style: italic;
    height: auto;
    vertical-align: baseline;
  }
</style>
