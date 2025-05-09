<template>
  <AlertMessage
    v-if="$fetchState.error"
    :error="$fetchState.error.message"
  />
  <ItemPreviewInterface
    v-else
    id="user-likes"
    data-qa="liked items"
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
  import { useLikedItems } from '@/composables/likedItems.js';
  import useScrollTo from '@/composables/scrollTo.js';

  export default {
    name: 'UserLikes',

    components: {
      AlertMessage,
      ItemPreviewInterface
    },

    beforeRouteLeave(_to, _from, next) {
      this.$store.commit('set/setSelected', []);
      next();
    },

    setup() {
      const { eventBus } = useLikedItems();
      const { scrollToSelector } = useScrollTo();

      return { eventBus, scrollToSelector };
    },

    data() {
      return {
        items: [],
        perPage: 24,
        total: 0
      };
    },

    fetch() {
      this.fetchLikes();
    },

    watch: {
      '$route.query.page'() {
        this.$fetch();
        this.scrollToSelector('#user-likes');
      }
    },

    mounted() {
      this.eventBus.on(this.fetchLikes);
    },

    beforeDestroy() {
      this.eventBus.off(this.fetchLikes);
      this.$store.commit('set/setSelected', []);
    },

    methods: {
      async fetchLikes() {
        if (!this.$store.state.set.likesId) {
          return {};
        }

        try {
          const response = await this.$apis.set.get(this.$store.state.set.likesId, {
            page: Number(this.$route.query.page || 1),
            pageSize: this.perPage,
            profile: 'items.meta'
          });
          this.items = response.items || [];
          this.total = response.partOf.total;
        } catch {
          this.items = [];
          this.total = 0;
        }
      }
    }
  };
</script>
