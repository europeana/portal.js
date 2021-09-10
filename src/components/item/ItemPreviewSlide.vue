<template>
  <div
    v-if="item.media && item.identifier"
    class="item-preview-slide"
    :class="variant"
  >
    <SmartLink
      :destination="url"
      link-class="card-link"
    >
      <div
        class="slide-wrapper"
      >
        <OptimisedImage
          :src="imageLink"
          :width="width"
          :height="height"
          alt
        />
      </div>
    </SmartLink>
  </div>
</template>

<script>
  import OptimisedImage from '../generic/OptimisedImage';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'ItemPreviewSlide',
    components: {
      OptimisedImage,
      SmartLink
    },
    props: {
      variant: {
        type: String,
        default: 'default'
      }
    },

    async fetch() {
      let randomItem;
      await this.$apis.record.search({
        qf: 'contentTier:4',
        rows: 1,
        facet: {
          'MIME_TYPE': 'image/jpeg',
          'IMAGE_SIZE': ['MEDIUM', 'LARGE', 'EXTRA_LARGE']
        },
        sort: 'random'
      })
        .then(response => {
          randomItem = response.items[0].id;
        })
        .catch(error => {
          return { error: error.message };
        });

      return this.$apis.record
        .getRecord(randomItem)
        .then(result => {
          return this.item = result.record;
        })
        .catch(error => {
          return { error: error.message };
        });
    },

    data() {
      return {
        item: {}
      };
    },

    computed: {
      height() {
        return this.item.media[0]?.ebucoreHeight || 0;
      },
      width() {
        return this.item.media[0]?.ebucoreWidth || 0;
      },

      url() {
        return { name: 'item-all', params: { pathMatch: this.item.identifier.slice(1) } };
      },
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.item.media[0].about, this.item.identifier, { disposition: 'inline' });
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  .item-preview-slide {
    height: 50vh;
    position: relative;
    margin: 4rem 0;
    .slide-wrapper {
      overflow-y: hidden;
      height: 50vh;
      position: absolute;
      width: 100vw;
      left: calc(50% - 50vw);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zoom-out .slide-wrapper {
    img {
      max-height: 3000px;
      transition: all 500ms ease;
    }
    &:hover img {
      max-height: 100%;
    }
  }
</style>
