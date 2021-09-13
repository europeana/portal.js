<template>
  <div
    v-if="item.media && item.identifier"
    class="item-preview-slide"
    :class="variant"
  >
    <div
      class="slide-wrapper-link"
      @mouseenter="show = true"
      @mouseleave="show = false"
    >
      <OptimisedImage
        :src="imageLink"
        :width="width"
        :height="height"
        alt
        :aria-hidden="show ? 'true' : null"
      />
      <div
        class="slide-overlay"
        :class="{ show }"
      >
        <SmartLink
          :destination="url"
          link-class="slide-link"
        >
          Discover this item
        </SmartLink>
        <UserButtons
          v-model="identifier"
          @like="$emit('like', identifier)"
          @unlike="$emit('unlike', identifier)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import OptimisedImage from '../generic/OptimisedImage';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'ItemPreviewSlide',
    components: {
      OptimisedImage,
      SmartLink,
      UserButtons: () => import('../account/UserButtons')
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
          'TYPE': 'IMAGE',
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
        item: {},
        show: false
      };
    },

    computed: {
      identifier() {
        return this.item.identifier;
      },
      image() {
        return this.item.media.filter(m => m.ebucoreHasMimeType === 'image/jpeg');
      },
      height() {
        return this.image[0]?.ebucoreHeight || 0;
      },
      width() {
        return this.image[0]?.ebucoreWidth || 0;
      },

      url() {
        return { name: 'item-all', params: { pathMatch: this.identifier.slice(1) } };
      },
      imageLink() {
        return this.$apis.record.mediaProxyUrl(this.image[0]?.about, this.identifier, { disposition: 'inline' });
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
    .slide-wrapper-link {
      overflow-y: hidden;
      height: 50vh;
      position: absolute;
      width: 100vw;
      left: calc(50% - 50vw);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .slide-overlay {

      background-color: rgba(0, 0, 0, 0.8);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      visibility: hidden;
      opacity: 0;
      transition: all 300ms ease-out;
      &.show {
        visibility: visible;
        opacity: 1;
        transition: all 300ms ease-in;
      }
      .slide-link {
        color: $offwhite;
        font-size: $font-size-large;
        margin-bottom: 1rem;
      }
    }
  }
  .zoom-out .slide-wrapper-link {
    img {
      max-height: 3000px;
      transition: all 500ms ease;
    }
    &:hover img {
      max-height: 100%;
    }
  }
</style>
