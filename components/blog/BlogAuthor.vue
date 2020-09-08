<template>
  <div class="author">
    <SmartLink
      v-if="url"
      :destination="url"
      class="font-weight-bold"
    >
      {{ name }}<!-- remove space
    --></SmartLink>
    <span v-else>{{ name }}</span><!-- remove space
    --><span
      v-if="multipleAuthors && !organisation"
      class="comma"
    >,</span>
    <span v-if="organisation">({{ organisation }})</span><!--
 --><span
      v-if="multipleAuthors && organisation"
      class="comma"
    >,</span>
  </div>
</template>

<script>
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'BlogAuthor',

    components: {
      SmartLink
    },

    props: {
      name: {
        type: String,
        required: true
      },

      organisation: {
        type: String,
        default: ''
      },

      url: {
        type: String,
        default: ''
      },

      multipleAuthors: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
