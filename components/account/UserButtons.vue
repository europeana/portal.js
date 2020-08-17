<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      class="icon-ic-add"
      data-qa="add to gallery button"
      :aria-label="$t('actions.addToGallery')"
      @click="showModal"
    />
    <b-button
      :pressed="liked"
      class="icon-heart"
      data-qa="like button"
      :aria-label="$t('actions.like')"
      size="sm"
      @click="toggleLiked"
    />
    <ModalCollection
      :modal-id="collectionModalId"
      :item-id="itemId"
    />
  </div>
</template>

<script>
  import ModalCollection from '../account/ModalCollection';

  export default {
    name: 'UserButtons',

    components: {
      ModalCollection
    },

    props: {
      itemUrl: {
        type: Object,
        default: () => {}
      }
    },

    fetch() {
      this.itemId = this.itemUrl.params.pathMatch;
    },

    data() {
      return {
        itemId: null
      };
    },

    computed: {
      collectionModalId() {
        return `collection-modal-${this.itemId}`;
      },
      liked() {
        return this.$store.state.set.liked.includes(this.itemId);
      },
      likesId() {
        return this.$store.state.set.likesId;
      }
    },

    methods: {
      async toggleLiked() {
        await (this.liked ? this.unlike() : this.like());
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
          this.$emit('add', this.itemId);
        });
      }
    }
  };
</script>
