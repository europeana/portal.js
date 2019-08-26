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
        toggle: false
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

    mounted () {
      this.toggle = this.toggled;
    },

    methods: {
      toggleHandler () {
        if (!this.toggle) {
          this.$emit('click', 'contentTier', ['*']);
          this.toggle = true;
        } else {
          this.$emit('click', 'contentTier', []);
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
