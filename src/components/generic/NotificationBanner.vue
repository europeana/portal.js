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
  @import '@/assets/scss/variables';
  @import '@/assets/scss/icons';

  .container-fluid {
    background: $blue;
    color: $white;
    margin-top: -1rem;
    padding-top: 1rem;

    a {
      color: $white;
    }

    p {
      line-height: 1.375rem;
      display: flex;

      &::before {
        content: '\e949';
        font-size: 1.25rem;
        margin-right: 0.75rem;

        @extend %icon-font;
      }
    }
  }
</style>
