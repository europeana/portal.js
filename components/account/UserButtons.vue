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
      :item-id="value"
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
      // Identifier of the item
      value: {
        type: String,
        required: true
      }
    },

    computed: {
      collectionModalId() {
        return `collection-modal-${this.value}`;
      },
      liked() {
        return this.$store.state.set.liked.includes(this.value);
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
        await this.$store.dispatch('set/like', this.value);
        this.$emit('like', this.value);
      },
      async unlike() {
        await this.$store.dispatch('set/unlike', this.value);
        this.$emit('unlike', this.value);
      },
      showModal() {
        this.$nextTick(() => {
          this.$bvModal.show(this.collectionModalId);
          this.$emit('add', this.value);
        });
      }
    }
  };
</script>
