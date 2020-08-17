<template>
  <b-card-group
    :data-qa="`item previews ${view}`"
    :class="cardGroupClass"
    deck
  >
    <ItemPreviewCard
      v-for="item in value"
      :key="item.europeanaId"
      :variant="cardVariant"
      :dc-creator="item.dcCreator"
      :dc-description="item.dcDescription"
      :dc-title="item.dcTitle"
      :edm-data-provider="item.edmDataProvider"
      :edm-preview="item.edmPreview"
      :europeana-id="item.europeanaId"
      :selector="item.selector"
      data-qa="item preview"
      @like="$emit('like', item.europeanaId)"
      @unlike="$emit('unlike', item.europeanaId)"
    />
    <b-toast
      id="new-collection-toast"
      toast-class="brand-toast"
      toaster="b-toaster-bottom-left"
      auto-hide-delay="5000"
      is-status
      no-close-button
      solid
      data-qa="tier toast"
    >
      {{ $t('collectionModal.newNotification') }}
    </b-toast>
  </b-card-group>
</template>

<script>
  import ItemPreviewCard from './ItemPreviewCard';

  export default {
    name: 'ItemPreviewCardGroup',

    components: {
      ItemPreviewCard
    },

    props: {
      value: {
        type: Array,
        default: () => []
      },
      perRow: {
        type: Number,
        default: 4
      },
      view: {
        type: String,
        default: 'grid'
      }
    },

    computed: {
      cardGroupClass() {
        return this.view === 'list' ? 'card-group-list mx-0' : `card-deck-search masonry card-deck-${this.perRow}-cols`;
      },

      cardVariant() {
        return this.view === 'list' ? 'list' : 'default';
      }
    },

    methods: {
      async toggleLiked() {
        await (this.liked ? this.unlike() : this.like());
        this.liked = !this.liked;
      },
      async like() {
        if (this.likesId === null) {
          await this.$store.dispatch('set/createLikes');
        }
        await this.$store.dispatch('set/like', this.itemId);
        this.$emit('like', this.itemId);
      },
      async unlike() {
        await this.$store.dispatch('set/unlike', this.itemId);
        this.$emit('unlike', this.itemId);
      },
      showModal() {
        this.$nextTick(() => {
          this.$bvModal.show(this.collectionModalId);
        });
      }
    }
  };
</script>
