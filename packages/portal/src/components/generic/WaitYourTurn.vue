<template>
  <div>
    <template
      v-for="section in sections"
    >
      <transition
        :key="section"
        appear
        :name="transitionName"
      >
        <div
          v-show="mayShowSection(section)"
        >
          <slot
            :name="section"
          />
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'WaitYourTurn',

    props: {
      sections: {
        type: Array,
        default: () => []
      },

      ready: {
        type: Array,
        default: () => []
      },

      timeoutDelay: {
        type: Number,
        default: 600
      },

      transitionName: {
        type: String,
        default: 'fade'
      }
    },

    data() {
      return {
        showAllSections: false,
        timeout: null
      };
    },

    watch: {
      'ready.length'() {
        if (this.timeout && this.sections.every((section) => this.ready.includes(section))) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
      }
    },

    mounted() {
      this.timeout = setTimeout(() => {
        this.showAllSections = true;
      }, this.timeoutDelay);
    },

    methods: {
      // A section may only be shown when its content is ready, and so
      // is the content of all earlier sections. This prevents e.g. the 3rd
      // section being shown 1st if it's quicker to fetch, then the 1st and 2nd
      // sections being shown causing the 3rd to jump down in the view.
      mayShowSection(candidate) {
        if (this.showAllSections) {
          return true;
        }
        const index = this.sections.findIndex((section) => section === candidate);
        return this.sections.slice(0, index + 1)
          .every((section) => this.ready.includes(section));
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables';

  // TODO: move to assets dir to support arbitrary transitionName prop values
  .fade-enter-active {
    transition: $standard-transition;
    opacity: 0;
  }

  .fade-enter-to {
    opacity: 1;
  }
</style>
