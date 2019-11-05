<template>
  <li
    v-if="locale !== null"
    :lang="locale"
    data-qa="entity value"
  >
    <SmartLink
      v-if="isEuropeanaEntity"
      :destination="{ name: 'entity-type-all', params: { type: destination.type, pathMatch: destination.id } }"
    >
      {{ value }}
    </SmartLink>
    <template
      v-else
    >
      {{ value }}
    </template>
  </li>
  <li
    v-else
    data-qa="entity value"
  >
    <SmartLink
      v-if="isEuropeanaEntity"
      :destination="{ name: 'entity-type-all', params: { type: destination.type, pathMatch: destination.id } }"
    >
      {{ value }}
    </SmartLink>
    <template
      v-else
    >
      {{ value }}
    </template>
  </li>
</template>

<script>
  import { isEntityUri, entityParamsFromUri } from '../../plugins/europeana/entity';
  import SmartLink from '../generic/SmartLink';

  export default {
    components: {
      SmartLink
    },
    props: {
      value: {
        type: String,
        default: null
      },
      about: {
        type: String,
        default: null
      },
      locale: {
        type: String,
        default: null
      }
    },
    computed: {
      isEuropeanaEntity() {
        if (!this.about) {
          return false;
        }
        return isEntityUri(this.about);
      },
      destination() {
        if (!this.isEuropeanaEntity) {
          return this.about;
        }
        return entityParamsFromUri(this.about);
      }
    }
  };
</script>
