<template>
  <div class="primary-cta">
    <RichText
      :text="text"
      :rich-text-is-card="false"
      class="primary-cta-rich-text"
    />
    <SmartLink
      :destination="link.url"
      data-qa="call to action"
      class="btn btn-cta btn-primary d-inline-flex align-items-center"
    >
      {{ link.text }}
    </SmartLink>
  </div>
</template>

<script>
  import SmartLink from '../generic/SmartLink';
  import RichText from './RichText';

  export default {
    name: 'PrimaryCallToAction',

    components: {
      SmartLink,
      RichText
    },
    props: {
      text: {
        type: String,
        default: ''
      },
      link: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  .primary-cta {
    background-color: $bodygrey;
    padding: 1.5rem calc((50vw - 50%) / 2);
    margin: 0 calc((-50vw + 50%) / 2);
    max-width: calc(100% + 100px);
    @media (min-width: $bp-large) {
      padding: 1.5rem 50px;
      margin: 0 -50px;
    }
    // padding: 1.5rem;
    // margin: 0 -1.5rem;
    // @media (min-width: $bp-medium) {
    //   padding: 1.5rem 50px;
    //   margin: 0 -50px;
    // }
    .btn-primary.btn-cta {
      margin-bottom: 0;
    }
  }
</style>
