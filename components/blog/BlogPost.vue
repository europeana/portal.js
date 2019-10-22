<template>
  <b-row
    class="flex-md-row"
    data-qa="blog post"
  >
    <b-col cols="12">
      <article class="card card-body">
        <h1 data-qa="blog post title">
          {{ title }}
        </h1>
        <time
          v-if="datePublished"
          class="font-weight-bold pb-3"
          data-qa="date"
          :datetime="datePublished"
        >
          {{ $d(new Date(datePublished), 'short') }}
        </time>
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="html" />
        <!-- eslint-enable vue/no-v-html -->
      </article>
    </b-col>
  </b-row>
</template>

<script>
  import marked from 'marked';

  export default {
    name: 'BlogPost',

    props: {
      datePublished: {
        type: String,
        default: ''
      },

      title: {
        type: String,
        required: true
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
