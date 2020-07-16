<template>
  <b-modal
    id="shareModal"
    title="Share"
    hide-header-close
    hide-footer
  >
    <div class="icon-wrapper">
      <SocialShare
        :media-url="url"
        with-text
      />
    </div>
    <b-button
      variant="outline-primary"
      class="mt-5"
      @click="$bvModal.hide('shareModal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  import SocialShare from './SocialShare';

  export default {
    name: 'SocialShareModal',

    components: {
      SocialShare
    },

    props: {
      url: {
        type: String,
        default: null
      }
    }
  };
</script>

