<template>
  <b-form
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group class="has-autosuggestion">
      <b-form-input
        ref="searchForm"
        v-model="query"
        autocomplete="off"
        @input="$emit('input', $event)"
        @blur="isActive = false"
        @focus="activateDropdown"
      />
      <b-list-group
        v-if="isActive"
        class="autosuggestion-dropdown"
      >
        <b-list-group-item
          v-for="(value, name, index) in options"
          :key="index"
          :href="name"
          :class="{ 'highlighted': index === focus }"
          :value="value"
          @mouseover="focus = index"
        >
          {{ value }}
        </b-list-group-item>
      </b-list-group>
    </b-input-group>
  </b-form>
</template>

<script>
  export default {
    name: 'AutoComplete',

    props: {
      options: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        query: null,
        focus: null,
        isActive: false
      };
    },

    watch: {
      options() {
        this.isActive = !!this.options && this.query.length > 2;
      }
    },

    mounted() {
      document.addEventListener('keyup', this.navigateDropdown);
    },

    methods: {
      navigateDropdown() {
        switch (event.keyCode) {
        case 38:
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus > 0) {
            this.focus--;
          } else if (this.focus === 0) {
            this.focus = null;
          }
          break;
        case 40:
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus < Object.keys(this.options).length - 1) {
            this.focus++;
          }
          break;
        }

        this.$nextTick(() => {
          const highlighted = document.querySelector('.highlighted');
          if (!highlighted) return;
          this.query = highlighted.getAttribute('value');
        });
      },

      activateDropdown() {
        return !this.isActive && this.options;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .has-autosuggestion {
    position: relative;
  }

  .autosuggestion-dropdown {
    position: absolute;
    top: 50px;
    width: 100%;
    z-index: 20;

    a.list-group-item {
      border: 0;
      box-shadow: none;
      padding: .75rem 1.25rem;

      &.highlighted {
        color: red;
      }
    }
  }
</style>
