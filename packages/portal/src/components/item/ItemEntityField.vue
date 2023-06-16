<template>
  <span>
    <SmartLink
      v-if="isEuropeanaEntity"
      :destination="{ name: 'collections-type-all', params: { type: destination.type, pathMatch: destination.id } }"
    >
      {{ text }}
    </SmartLink>
    <template
      v-else
    >
      {{ text }}
    </template>
  </span>
</template>

<script>
  import SmartLink from '../generic/SmartLink';

  import { isEntityUri, entityParamsFromUri } from '@/plugins/europeana/entity';

  export default {
    name: 'ItemEntityField',

    components: {
      SmartLink
    },

    props: {
      text: {
        type: String,
        default: null
      },
      about: {
        type: String,
        required: true
      }
    },

    computed: {
      isEuropeanaEntity() {
        return isEntityUri(this.about);
      },
      destination() {
        return this.isEuropeanaEntity ? entityParamsFromUri(this.about) : this.about;
      }
    }
  };
</script>

<style lang="scss" scoped>
  a {
    display: inline-block;
    padding-left: 0.2rem;
  }
</style>
