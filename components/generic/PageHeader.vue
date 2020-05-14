<template>
  <header class="row">
    <b-col
      cols="12"
      :lg="mediaUrl ? 9 : 12"
      class="col lead mt-3"
    >
      <h1
        data-qa="gallery title"
      >
        {{ title }}
      </h1>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="htmlDescription"
        v-html="htmlDescription"
      />
      <!-- eslint-enable vue/no-v-html -->
      <p v-if="rawDescription">
        {{ rawDescription }}
      </p>
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
  import SocialShare from '../../components/generic/SocialShare';

  export default {
    components: {
      SocialShare
    },
    props: {
      title: {
        type: String,
        required: true
      },

      rawDescription: {
        type: String,
        default: null
      },

      htmlDescription: {
        type: String,
        default: null
      },

      mediaUrl: {
        type: String,
        default: null
      }
    }
  };
</script>
