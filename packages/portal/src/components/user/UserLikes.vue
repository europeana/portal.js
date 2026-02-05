<template>
  <AlertMessage
    v-if="$fetchState.error"
    :error="$fetchState.error.message"
  />
  <ItemPreviewInterface
    v-else
    id="user-likes"
    :loading="$fetchState.pending"
    :items="items"
    :per-page="perPage"
    :total="total"
  >
    <template #no-items>
      <p
        class="text-center pb-4"
      >
        {{ $t('account.notifications.noLikedItems') }}
      </p>
    </template>
  </ItemPreviewInterface>
</template>

<script>
  import AlertMessage from '@/components/generic/AlertMessage';
  import ItemPreviewInterface from '@/components/item/ItemPreviewInterface';
  import useScrollTo from '@/composables/scrollTo.js';
  import { useSelectedItems } from '@/composables/selectedItems.js';

  export default {
    name: 'UserLikes',

    components: {
      AlertMessage,
      ItemPreviewInterface
    },

    setup() {
      const { scrollToSelector } = useScrollTo();
      const { clear: clearSelectedItems } = useSelectedItems();

      return { clearSelectedItems, scrollToSelector };
    },

    data() {
      return {
        items: [],
        perPage: 24,
        total: 0
      };
    },

    async fetch() {
      await this.fetchLikes();
      await this.$nextTick(); // so that items are updated before loading prop passed to ItemPreviewInterface
    },

    watch: {
      '$route.query.page'() {
        this.$fetch();
        this.scrollToSelector('#user-likes');
      }
    },

    created() {
      this.$likedItems.on('like', this.$fetch);
      this.$likedItems.on('unlike', this.$fetch);
    },

    beforeDestroy() {
      this.clearSelectedItems();
      this.$likedItems.off('like', this.$fetch);
      this.$likedItems.off('unlike', this.$fetch);
    },

    methods: {
      async fetchLikes() {
        if (!this.$store.state.set.likesId) {
          return {};
        }

        const response = await this.$apis.set.get(this.$store.state.set.likesId, {
          page: Number(this.$route.query.page || 1),
          pageSize: this.perPage,
          profile: 'items.meta'
        });
        this.items = response.items || [];
        this.total = response.partOf?.total || 0;
      }
    }
  };
</script>
