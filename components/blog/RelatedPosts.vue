<template>
  <b-row
    class="flex-md-row pt-3"
    data-qa="blog related posts"
  >
    <b-col
      cols="12"
    >
      <h2>#Related posts</h2>
    </b-col>
    <b-col
      cols="12"
    >
      <div class="card-deck">
        <!-- This will be a for-loop -->
        <RelatedPost />
        <RelatedPost />
      </div>
    </b-col>
  </b-row>
</template>

<script>
  import RelatedPost from '../../components/blog/RelatedPost';

  export default {
    name: 'RelatedPosts',

    components: {
      RelatedPost
    },

    props: {}
  };
</script>
