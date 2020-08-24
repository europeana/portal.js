<template>
  <div
    class="user-buttons"
    data-qa="user buttons"
  >
    <client-only>
      <b-button
        class="icon-ic-add"
        data-qa="add button"
        :aria-label="$t('set.actions.addTo')"
        @click="addToSet"
      />
      <b-button
        :pressed="liked"
        class="icon-heart"
        data-qa="like button"
        :aria-label="$t('actions.like')"
        size="sm"
        @click="toggleLiked"
      />
      <template
        v-if="$auth.loggedIn"
      >
        <AddItemToSetModal
          data-qa="add item to set modal"
          :modal-id="addItemToSetModalId"
          :item-id="value"
        />
      </template>
    </client-only>
  </div>
</template>

<script>
  import ClientOnly from 'vue-client-only';

  export default {
    name: 'UserButtons',

    components: {
      AddItemToSetModal: () => import('../set/AddItemToSetModal'),
      ClientOnly
    },

    props: {
      // Identifier of the item
      value: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        addItemToSetModalId: `add-item-to-set-modal-${this.value}`
      };
    },

    computed: {
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
      addToSet() {
        if (this.$auth.loggedIn) {
          this.$bvModal.show(this.addItemToSetModalId);
        } else {
          this.$auth.loginWith('keycloak');
        }
      }
    }
  };
</script>
