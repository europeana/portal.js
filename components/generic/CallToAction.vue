<template>
  <SmartLink
    :destination="url"
    data-qa="call to action"
    class="btn btn-cta btn-primary d-inline-flex align-items-center"
  >
    {{ text }}
  </SmartLink>
</template>

<script>
  import SmartLink from '../../components/generic/SmartLink';
  export default {
    components: {
      SmartLink
    },
    props: {
      url: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      }
    }
  };
</script>
