<template>
  <div class="pb-3">
    <strong>{{ name }}</strong>
    <br>
    <span v-if="organisation">
      {{ organisation }}
    </span>
    <SmartLink
      v-if="url"
      :destination="url"
    >
      {{ url }}
    </SmartLink>
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
      }
    }
  };
</script>
