<template>
  <header class="content-header row">
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
        {{ title }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        v-html="description"
      />
      <!-- eslint-enable vue/no-v-html -->
      <template v-if="mediaUrl">
        <ShareButton
          :variant="buttonVariant"
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
        required: true
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
      },

      buttonVariant: {
        type: String,
        default: 'outline-primary'
      }
    }
  };
</script>
