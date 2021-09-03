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
        {{ title }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="description"
        v-html="description"
      />
      <!-- eslint-enable vue/no-v-html -->
    </b-col>
    <b-col
      v-if="mediaUrl"
      cols="12"
      lg="3"
      class="pt-0 pb-3 py-lg-3 text-left text-lg-right"
    >
      <SocialShare
        :media-url="mediaUrl"
      />
    </b-col>
  </header>
</template>

<script>
  import SocialShare from '../../components/sharing/SocialShare';

  export default {
    components: {
      SocialShare
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
      }
    }
  };
</script>
