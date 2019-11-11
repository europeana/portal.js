<template>
  <li
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
        default: null,
        required: true
      },
      locale: {
        type: String,
        default: null
      }
    },
    computed: {
      isEuropeanaEntity() {
        return !this.about ? false : isEntityUri(this.about);
      },
      destination() {
        return !this.isEuropeanaEntity ? this.about : entityParamsFromUri(this.about);
      }
    }
  };
</script>
