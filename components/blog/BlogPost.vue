<template>
  <b-row
    class="flex-md-row"
    data-qa="blog post"
  >
    <b-col
      cols="12"
    >
      <h1
        data-qa="blog post title"
      >
        {{ title }}
      </h1>

      <figure v-if="imagePath">
        <img
          :src="imagePath"
          :alt="imageTitle"
        >
      </figure>
      <!-- eslint-disable vue/no-v-html -->
      <div v-html="html" />
      <!-- eslint-enable vue/no-v-html -->
    </b-col>
  </b-row>
</template>

<script>
  import marked from 'marked';

  export default {
    name: 'BlogPost',

    props: {
      title: {
        type: String,
        required: true
      },

      imagePath: {
        type: String,
        default: null
      },

      imageTitle: {
        type: String,
        default: ''
      },

      body: {
        type: String,
        required: true
      }
    },

    computed: {
      html() {
        return marked(this.body);
      }
    }
  };
</script>
