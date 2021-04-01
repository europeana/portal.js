<template>
  <div class="author">
    <span
      v-if="url"
    >
      <SmartLink
        :destination="url"
        class="font-weight-bold"
      >
        {{ name }}<!-- remove space
      --></SmartLink>
    </span>
    <span v-else>{{ name }}</span>
    <span v-if="organisation">({{ organisation }})</span>
    <span
      v-if="numberOfAuthors > 1"
      class="pr-1 comma"
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

      numberOfAuthors: {
        type: Number,
        default: 1
      }
    }
  };
</script>

<style lang="scss" scoped>
  .author:last-of-type .comma {
    display: none;
  }
</style>
