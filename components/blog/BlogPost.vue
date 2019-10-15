<template>
  <b-row
    class="flex-md-row"
    data-qa="blog post"
  >
    <b-col cols="12">
      <article class="card">
        <div class="card-body">
          <h1 data-qa="blog post title">
            {{ title }}
          </h1>

          <!-- eslint-disable vue/no-v-html -->
          <div v-html="html" />
          <!-- eslint-enable vue/no-v-html -->
        </div>
      </article>
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
