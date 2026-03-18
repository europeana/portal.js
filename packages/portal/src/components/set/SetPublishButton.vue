<template>
  <b-button
    :variant="publishedSet ? 'secondary' : 'primary'"
    class="text-decoration-none"
    data-qa="publish set button"
    @click="togglePublishedSet"
  >
    {{ publishedSet ? $t('actions.depublish') : $t('actions.publish') }}
  </b-button>
</template>

<script>
  import useMakeToast from '@/composables/makeToast.js';

  export default {
    name: 'SetPublishButton',

    inject: ['currentSet', 'fetchCurrentSet'],

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

    setup() {
      const { makeToast } = useMakeToast();
      return { makeToast };
    },

    computed: {
      publishedSet() {
        return this.visibility === 'published';
      }
    },

    methods: {
      async togglePublishedSet() {
        try {
          const visibilityWas = this.visibility;
          await this.fetchCurrentSet();
          if (visibilityWas === this.currentSet.visibility) {
            if (this.publishedSet) {
              await this.$apis.set.unpublish(this.setId);
            } else {
              await this.$apis.set.publish(this.setId);
            }

            this.fetchCurrentSet();
          } else {
            this.makeToast(this.$t('set.notifications.visibilityChanged', { visibility: this.currentSet.visibility }), {
              variant: 'warning'
            });
          }
        } catch (e) {
          this.$error(e, { scope: 'gallery' });
        }
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
  <SetPublishButton
    set-id="001"
    visibility="public"
  />
  ```
</docs>
