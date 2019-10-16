<template>
  <div class="pb-3">
    <SmartLink
      v-if="url"
      :destination="url"
      class="font-weight-bold"
    >
      {{ name }}
    </SmartLink>
    <strong v-else>{{ name }}</strong>
    <br>
    <span v-if="organisation">
      {{ organisation }}
    </span>
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
