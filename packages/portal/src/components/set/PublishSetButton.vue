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
  export default {
    name: 'PublishSetButton',

    props: {
      setId: {
        type: String,
        required: true
      },
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
      togglePublishedSet() {
        if (this.publishedSet) {
          this.$store.dispatch('set/unpublish', this.setId);
        } else {
          this.$store.dispatch('set/publish', this.setId);
        }
      }
    }
  };
</script>
