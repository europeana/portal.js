<template>
  <div class="pb-3">
    <SmartLink
      v-if="url"
      :destination="url"
      class="font-weight-bold"
    >
      {{ name }}<!-- remove space
    --></SmartLink>
    <strong v-else>{{ name }}</strong>
    <strong v-if="organisation">
      ({{ organisation }})
    </strong>
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
