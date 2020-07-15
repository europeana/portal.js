<template>
  <b-modal id="shareModal" title="Share" hide-header-close hide-footer>
    <SocialShare :media-url="url" />
    <b-button variant="outline-primary" class="mt-3" block @click="$bvModal.hide('shareModal')">Close</b-button>
  </b-modal>
</template>

<script>
  import { mapGetters } from 'vuex';
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

