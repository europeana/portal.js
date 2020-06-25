<template>
  <div class="tabbed-layout">
    <b-row class="bg-white">
      <b-col class="tab-container mt-2 mb-0.5 pt-4">
        <b-tabs
          v-model="activeTab"
          pills
          nav-class="tab-list"
          active-nav-item-class="tab-active"
          align="center"
        >
          <b-tab
            v-for="tab in tabs"
            :id="'tab-' + tab.id"
            :key="tab.id"
            lazy
            :title="tab.title"
            align="center"
            @click="switchTab(tab.id)"
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
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import ContentCard from '../generic/ContentCard';
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
      retrieveTabResults() {
        // TODO: retrieve the desired data from Sets API, and fill the results array, so that they can be rendered inside the tab's card
        axios
          .get(this.activeCard)
          .then(response => (this.results = response.data.items))
          .catch(error => (console.error(error)));
      },
      switchTab(id) {
        this.activeTab = id;
        this.activeView = this.tabs[id].view;
        this.activeCard = this.tabs[id].card;
        this.results.splice(0, this.results.length);
        this.retrieveTabResults();
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

<style lang="scss">
  @import '../../assets/scss/tabs.scss';
</style>
