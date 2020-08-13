<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      class="icon-ic-add"
      data-qa="add to gallery button"
      :aria-label="$t('actions.addToGallery')"
      @click="showModal()"
    />
    <b-button
      :pressed="liked"
      class="icon-heart"
      data-qa="like button"
      :aria-label="$t('actions.like')"
      size="sm"
      @click="toggleLiked()"
    />
    <ModalCollection
      :item-id="itemId"
      :modal-id="collectionModalId"
      :lazy="true"
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
  </div>
</template>

<script>
  export default {
    name: 'UserButtons',

    components: {
      ModalCollection: () => import('../account/ModalCollection.vue')
    },

    props: {
      itemUrl: {
        type: Object,
        default: () => {}
      }
    },
    async fetch() {
      this.liked = this.$store.state.set.liked.includes(this.itemId);
    },

    data() {
      return {
        liked: false
      };
    },
    computed: {
      itemId() {
        return this.itemUrl.params[0];
      },
      likesId() {
        return this.$store.state.set.likesId;
      },
      collectionModalId() {
        return `modal-collection-${this.itemId}`;
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
      },
      async unlike() {
        await this.$store.dispatch('set/unlike', this.itemId);
      },
      showModal() {
        this.$nextTick(() => {
          // this.$store.commit('modal/setModalData', this.itemId);
          this.$bvModal.show(this.collectionModalId);
        });
      }
    }
  };
</script>
