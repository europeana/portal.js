<template>
  <address>
    <SmartLink
      v-if="url"
      :destination="url"
      class="font-weight-bold"
    >
      {{ name }}
    </SmartLink>
    <span v-else>{{ name }}</span>
    <span v-if="organisation">({{ organisation }})</span>
  </address>
</template>

<script>
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'StoryAuthor',

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
      }
    }
  };
</script>
