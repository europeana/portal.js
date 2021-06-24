<template>
  <b-container>
    <slot name="header" />
    <b-row class="flex-md-row">
      <b-col cols="12">
        <div
          v-if="emptyText && value && value.length === 0"
          class="text-center pb-4"
        >
          {{ emptyText }}
        </div>
        <b-card-group
          class="card-deck-4-cols pb-5"
          deck
        >
          <ContentCard
            v-for="set in value"
            :key="set.id"
            :sub-title="setSubTitle(set)"
            :title="set.title"
            :image-url="$apis.set.getSetThumbnail(set)"
            :texts="[set.description]"
            :url="{ name: 'set-all', params: { pathMatch: setPathMatch(set) } }"
            data-qa="user set"
          />
          <CreateSetButton
            v-if="showCreateSetButton"
            :visibility="visibility"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import ContentCard from '../generic/ContentCard';

  export default {
    name: 'UserSets',
    components: {
      ContentCard,
      CreateSetButton: () => import('./CreateSetButton')
    },
    props: {
      value: {
        type: Array,
        required: true
      },
      showCreateSetButton: {
        type: Boolean,
        default: true
      },
      // May be "public" or "private"
      visibility: {
        type: String,
        default: 'public'
      },
      emptyText: {
        type: String,
        default: null
      }
    },
    methods: {
      setSubTitle(set) {
        const setTotal = set.total || 0;
        return this.$tc('items.itemCount', setTotal, { count: setTotal });
      },
      setPathMatch(set) {
        return set.id.replace('http://data.europeana.eu/set/', '');
      }
    }
  };
</script>
