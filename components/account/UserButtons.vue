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
    data() {
      return {
        liked: false
      };
    },
    computed: {
      itemId() {
        return this.itemUrl.params[0];
      },
      likesId: {
        get() {
          return this.$store.state.set.likesId;
        },
        set(value) {
          this.$store.commit('set/setLikesId', value);
        }
      }
    },
    methods: {
      async setLikesId() {
        const creator = this.$auth.user ? this.$auth.user.sub : '';
        let likes = await this.$sets.getLikes(creator);
        if (likes === '') {
          const response = await this.$sets.createLikes();
          likes = response.id.split('/').pop();
        }
        this.likesId = likes;
      },
      async toggleLiked() {
        await (this.liked ? this.unlike() : this.like());
        this.liked = !this.liked;
      },
      async like() {
        if (this.likesId === null) {
          await this.setLikesId();
        }
        await this.$sets.modifyItems('add', this.likesId, this.itemId);
      },
      async unlike() {
        await this.$sets.modifyItems('delete', this.likesId, this.itemId);
      }
    }
  };
</script>
