<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <b-button
      class="icon-ic-add"
      data-qa="add to gallery button"
      :aria-label="$t('actions.addToGallery')"
    />
    <b-button
      :pressed="liked"
      class="icon-heart"
      data-qa="like button"
      :aria-label="$t('actions.like')"
      size="sm"
      @click="toggleLiked()"
    />
  </div>
</template>

<script>
  export default {
    name: 'UserButtons',

    props: {
      itemUrl: {
        type: Object,
        default: () => {}
      }
    },
    fetch() {
      this.itemId = this.itemUrl.params.pathMatch;
      this.liked = this.$store.state.set.liked.includes(this.itemId);
    },
    data() {
      return {
        itemId: null,
        liked: false
      };
    },
    computed: {
      likesId() {
        return this.$store.state.set.likesId;
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
      }
    }
  };
</script>
