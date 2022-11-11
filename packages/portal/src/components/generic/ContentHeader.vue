<template>
  <header class="row">
    <b-col
      cols="12"
      lg="9"
      class="col lead mt-3"
    >
      <div
        v-if="contextLabel"
        class="context-label"
        data-qa="context label"
      >
        {{ contextLabel }}
      </div>
      <h1
        data-qa="page title"
      >
        {{ localTitle }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        v-html="description"
      />
      <!-- eslint-enable vue/no-v-html -->
      <template v-if="mediaUrl">
        <ShareButton
          variant="outline-primary"
          class="mt-4"
        />
        <SocialShareModal :media-url="mediaUrl" />
      </template>
    </b-col>
  </header>
</template>

<script>
  import ShareButton from '../../components/sharing/ShareButton';
  import SocialShareModal from '../../components/sharing/SocialShareModal';

  export default {
    name: 'ContentHeader',

    components: {
      ShareButton,
      SocialShareModal
    },

    props: {
      title: {
        type: String,
        default: null
      },

      description: {
        type: String,
        default: null
      },

      mediaUrl: {
        type: String,
        default: null
      },

      contextLabel: {
        type: String,
        default: null
      }
    },

    computed: {
      localTitle() {
        return this.title || this.$store.state.pageMeta.data.title;
      }
    }
  };
</script>
