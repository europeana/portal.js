<template>
  <b-button
    :variant="publishedSet ? 'secondary' : 'primary'"
    class="text-decoration-none ml-2"
    data-qa="publish set button"
    @click="togglePublishedSet"
  >
    {{ publishedSet ? $t('actions.depublish') : $t('actions.publish') }}
  </b-button>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';

  export default {
    name: 'PublishSetButton',

    mixins: [makeToastMixin],

    props: {
      /**
       * Id of the set
       */
      setId: {
        type: String,
        required: true
      },
      /**
       * Active visibility status: public, private or published
       */
      visibility: {
        type: String,
        default: 'public'
      }
    },

    computed: {
      publishedSet() {
        return this.visibility === 'published';
      }
    },

    methods: {
      async togglePublishedSet() {
        const visibilityWas = this.visibility;
        await this.$store.dispatch('set/fetchActive', this.setId);
        if (visibilityWas === this.$store.state.set.active.visibility) {
          if (this.publishedSet) {
            this.$store.dispatch('set/unpublish', this.setId);
          } else {
            this.$store.dispatch('set/publish', this.setId);
          }
        } else {
          this.makeToast(this.$t('set.notifications.visibilityChanged', { visibility: this.$store.state.set.active.visibility }), {
            variant: 'warning'
          });
        }
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
  <PublishSetButton
    set-id="001"
    :visibility="$store.state.set.active.visibility"
  />
  ```
</docs>
