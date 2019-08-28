<template>
  <div>
    <b-img
      v-if="depictionThumbnail"
      :src="depictionThumbnail"
      class="mb-3"
      fluid
      alt=""
      data-qa="entity depiction"
      @error="depictionNotFound"
    />
    <p class="attribution">
      <b-link
        v-if="attribution"
        :href="attribution"
        target="_blank"
        data-qa="entity attribution"
      >
        {{ $t('resourceWikimedia') }}
      </b-link>
    </p>
    <p
      data-qa="entity description"
    >
      {{ description }}
    </p>
  </div>
</template>

<script>
  export default {
    props: {
      depiction: {
        type: String,
        default: ''
      },
      attribution: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        depictionThumbnail: this.depiction
      };
    },
    methods: {
      depictionNotFound() {
        // clear depictionThumbnail and attribution to prevent showing a broken image and
        // contextless link
        this.depictionThumbnail = '';
        this.attribution = '';
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "./assets/scss/variables.scss";

  img {
    border-radius: $border-radius-small;
    box-shadow: $boxshadow-small;
  }

  .attribution {
    font-size: $font-size-extrasmall;
  }
</style>
