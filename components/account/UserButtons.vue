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
      @click="doLike()"
    />
  </div>
</template>

<script>
  export default {
    name: 'UserButtons',

    props: {
      itemUrl: {
        type: [String, Object],
        default: ''
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
      }
    },

    methods: {
      setLikesId(id) {
        if (process.browser) {
          localStorage.setItem('likesId', id);
        }
      },

      getLikesId() {
        return localStorage.getItem('likesId');
      },

      doLike() {
        this.liked ? this.like(false) : this.like(true);
        return this.liked = !this.liked;
      },

      async like(val) {
        if (val) {
          if (!this.getLikesId()) {
            const response = await this.$galleries.createLikes();
            this.setLikesId(response.id.split('/').pop());
          }
          await this.$galleries.modifyItems('add', this.getLikesId(), this.itemId);
        } else {
          await this.$galleries.modifyItems('delete', this.getLikesId(), this.itemId);
        }
      }
    }
  };
</script>
