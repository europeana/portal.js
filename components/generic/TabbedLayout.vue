<template>
  <div class="tabbed-layout">
    <b-row class="bg-white">
      <b-col class="mt-2 mb-0.5 pt-4">
        <b-nav
          class="nav-list"
          align="center"
          data-qa="account navigation"
        >
          <li
            v-for="tab in tabs"
            :key="tab.id"
            class="nav-item"
          >
            <a
              :id="'tab-' + tab.id"
              class="nav-link"
              :class="{active: activeTab==tab.id}"
              @click="switchTab(tab.id)"
            >
              <span>{{ tab.title }}</span>
            </a>
          </li>
        </b-nav>
      </b-col>
    </b-row>
    <b-row
      align-h="center"
      class="bg mt-5"
    >
      <b-col
        cols="9"
      >
        <!-- TODO: Update this section to preview the results retrieved with Sets API -->
        <b-card-group
          v-if="activeView === 'grid'"
          :class="`card-deck-search masonry card-deck-${perRow}-cols`"
          deck
        >
          <ContentCard
            v-for="result in results"
            :key="result.id"
            :title="result.title[0] || result.dcDescription[0]"
            :url="{ name: 'item-all', params: { pathMatch: result.id.slice(1) } }"
            :image-url="result.edmPreview[0]"
            :texts="cardTexts(result)"
            data-qa="search result"
            :limit-values-within-each-text="3"
            :omit-all-uris="true"
            :blank-image-height="280"
          />
        </b-card-group>
        <!-- TODO: End -->
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import ContentCard from './ContentCard';
  import axios from 'axios';

  export default {
    components: {
      ContentCard
    },
    props: {
      selectedTab: {
        type: Number,
        default: 0
      },
      tabs: {
        type: Array,
        default: () => [{}]
      }
    },
    data() {
      return {
        activeTab: this.selectedTab,
        activeView: 'grid',
        activeCard: this.tabs[this.selectedTab],
        perRow: 4,
        results: []
      };
    },
    mounted() {
      this.switchTab(this.activeTab);
    },
    methods: {
      switchTab(id) {
        this.activeTab = id;
        this.activeView = this.tabs[id].view;
        this.activeCard = this.tabs[id].card;
        // TODO: retrieve the desired data from Sets API, and fill the results array, so that they can be rendered inside the tab's card
        axios
          .get(this.activeCard)
          .then(response => (this.results = response.data.items))
          .catch(error => (console.error(error)));
        // TODO: End
      },
      cardTexts(result, variant) {
        const texts = [result.edmDataProvider];
        if (result.dcCreator) texts.unshift(result.dcCreator);

        if (variant === 'list') {
          if (!result.selector && result.dcDescription) texts.unshift(result.dcDescription);
        }

        return texts;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .nav-list {
    &:after {
      content: '';
      position: absolute;
      border-bottom: solid 2px $paper;
      display: block;
      width: 100%;
      z-index: 0.9;
      left: 0;
      right: 0;
      bottom: -0.2rem;
    }
  }

  .nav-item {
    font-weight: 600;
    &:not(:last-child) {
      margin-right: 0.2rem;
    }
    .nav-link {
      color: $mediumgrey;
      text-decoration: none;
      font-size: $font-size-small;
      &:hover {
        cursor: pointer;
      }
      &.active {
        color: $blue;
        &:after {
          content: '';
          position: absolute;
          border-bottom: solid 2px $blue;
          display: block;
          width: 100%;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: -0.2rem;
        }
      }
      span {
        position: relative;
      }
    }
  }
</style>
