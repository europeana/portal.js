<template>
  <div class="media-error-message d-flex">
    <span class="icon-info" />
    <div>
      {{ $t('errorMessage.mediaFailure.description') }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MediaErrorMessage'
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.media-error-message {
  color: $white;
  max-width: $max-text-column-width;
  padding: 2.5rem 2rem 0;
  margin: 0 auto;
}

.icon-info {
  font-size: $font-size-medium;
  line-height: 1.5rem;
  margin-right: 1rem;

  &:before {
    display: inline-block;
    transform: rotateX(180deg);
  }
}
</style>
