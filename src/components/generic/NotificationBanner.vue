<template>
  <b-container
    fluid
    class="border-bottom"
    data-qa="notification banner"
  >
    <b-container>
      <b-row>
        <b-col class="col-12 pb-3">
          <p class="mb-0">
            {{ notificationText }}
            <a
              :href="notificationUrl"
              class="ml-1"
            >
              {{ notificationLinkText }}
            </a>
          </p>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
  export default {
    props: {
      notificationUrl: {
        type: String,
        required: true
      },
      notificationText: {
        type: String,
        required: true
      },
      notificationLinkText: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  p {
    line-height: 1.375rem;

    &:before {
      content: '\e900';
      font-size: 1.2rem;
      margin-right: 0.75rem;
      @extend .icon-font;
    }
  }
</style>
