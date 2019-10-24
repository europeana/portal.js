<template>
  <b-form
    inline
    @submit.prevent="submitForm"
  >
    <b-input-group class="auto-suggest">
      <template
        v-if="pillLabel"
        v-slot:prepend
      >
        <SearchBarPill
          :text="pillLabel"
          :remove-link-label="$t('removeFilter', { filterLabel: pillLabel })"
          :remove-link-to="removeLinkTo"
        />
      </template>
      <b-form-input
        v-model="query"
        :autocomplete="isEntityPage ? 'on' : 'off'"
        :aria-label="$t('search')"
        :placeholder="$t('searchPlaceholder')"
        name="query"
        data-qa="search box"
        @input="getSuggestions"
        @focus="activateDropdown"
      />
      <b-button
        type="submit"
        data-qa="search button"
        variant="primary"
      >
        <span class="sr-only">
          {{ $t('search') }}
        </span>
        <img
          src="../../assets/img/magnifier.svg"
          :alt="$t('search')"
        >
      </b-button>
      <b-list-group
        v-if="isActive"
        class="auto-suggest-dropdown"
      >
        <!-- eslint-disable vue/no-v-html -->
        <b-list-group-item
          v-for="(value, name, index) in options"
          :key="index"
          :href="name"
          :class="{ 'highlighted': index === focus }"
          :value="value"
          @mouseover="focus = index"
          @click="isActive = false"
          v-html="highlightResult(value)"
        />
        <!-- eslint-enable vue/no-v-html -->
      </b-list-group>
    </b-input-group>
  </b-form>
</template>

<script>
  import SearchBarPill from './SearchBarPill.vue';

  export default {
    name: 'AutoSuggest',

    components: {
      SearchBarPill
    },

    data() {
      return {
        query: null,
        focus: null,
        isActive: false,
        options: null
      };
    },

    computed: {
      onSearchablePage() {
        return this.$store.state.search.active;
      },

      pillLabel() {
        return this.$store.state.search.pill;
      },

      routePath() {
        if (this.onSearchablePage) {
          return this.$route.path;
        }
        return this.localePath({ name: 'search' });
      },

      removeLinkTo() {
        return {
          path: this.localePath({
            name: 'search'
          }),
          query: { ...this.$route.query, page: 1 }
        };
      },

      isEntityPage() {
        return this.$route.path.startsWith('/entity/');
      }
    },

    watch: {
      options() {
        this.isActive = !!this.options && this.query.length > 2;
      },
      '$route.query'() {
        this.onSearchablePage ? this.query = this.$store.state.search.query : this.query = '';
      }
    },

    mounted() {
      if (this.isEntityPage) return;
      document.addEventListener('keyup', this.navigateDropdown);
      document.addEventListener('mouseup', this.clickOutside);
      this.query = this.$store.state.search.query;
    },

    methods: {
      highlightResult(value) {
        const query = this.query;
        const regEx = new RegExp(query, 'ig'); // Case insensitive

        return value.replace(regEx, `<strong class="highlight">${query}</strong>`);
      },
      clickOutside(event) {
        const isChild = this.$el.contains(event.target);

        if (!isChild) {
          this.isActive = false;
        }
      },
      updateInputWithSelected() {
        this.$nextTick(() => {
          const hoveredElement = document.querySelector('.hover');
          if (!hoveredElement) return;
          this.query = hoveredElement.getAttribute('value');
        });
      },
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
          this.updateInputWithSelected();
          break;
        case 40:
          if (this.focus === null) {
            this.focus = 0;
          } else if (this.focus < Object.keys(this.options).length - 1) {
            this.focus++;
          }
          this.updateInputWithSelected();
          break;
        }
      },

      activateDropdown() {
        return !this.isActive && this.options;
      },

      async submitForm() {
        const newRouteQuery = { ...this.$route.query, ...{ query: this.query, page: 1, view: this.view } };
        const newRoute = { path: this.routePath, query: newRouteQuery };
        this.isActive = false;
        await this.$router.push(newRoute);
      },

      // FAKE DATA
      async getSuggestions() {
        if (this.isEntityPage) return;
        setTimeout(() => {
          this.options = {
            'http://data.europeana.eu/concept/base/83': 'Hello',
            'http://data.europeana.eu/concept/base/94': 'By Hello'
          };
        }, 500);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  .auto-suggest {
    &-dropdown {
      position: absolute;
      top: 50px;
      width: 100%;
      z-index: 20;
      border-radius: 10px;

      a.list-group-item {
        border: 0;
        box-shadow: none;
        padding: .75rem 1.25rem;
        color: $black;

        &.hover {
          background-color: $lightgrey;
        }

        &:last-child {
          border-radius: 0 0 6px 6px;
        }

        /deep/.highlight {
          color: $blue;
        }
      }
    }
  }

  .input-group {
    width: 100%;

    .input-group-prepend {
      align-items: center;
      background-color: $lightgrey;
      padding-left: .75rem;
      padding-right: .1rem;
      border-radius: 0.375rem 0 0 0.375rem;
    }
  }

  .form-control {
    background-color: $lightgrey;
    border-radius: $border-radius 0 0 $border-radius;
    margin-right: 0;
  }

  .btn {
    border-radius: 0 $border-radius $border-radius 0;

    img {
      display: flex;
    }
  }
</style>
