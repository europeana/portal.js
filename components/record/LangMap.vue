/*
 * @file Presentation of "LangMap" data type in metadata
 * @see {@link https://pro.europeana.eu/page/europeana-rest-api#getting-started|Datatypes}
 */

<template>
  <p data-qa="multi-lingual metadata">
    <ul>
      <li
        v-for="(mapValue, index) in mapContent"
        :key="index"
      >
        <SmartLink
          v-if="isEntityLink(mapValue)"
          :destination="mapValue.content.about"
        >
          <span
            v-for="(prefLabel, i) in mapValue.content.prefLabel"
            :key="i"
            :lang="i"
          >
            {{ prefLabel }}
          </span>
        </SmartLink>
        <span
          v-else-if="isEntity(mapValue)"
        >
          {{ mapValue.content.prefLabel }}
        </span>
        <span
          v-else-if="mapValue"
          :lang="mapValue"
        >
          {{ mapValue.content }}
        </span>
      </li>
    </ul>
  </p>
</template>

<script>
  import { isEntityUri } from '../../plugins/europeana/entity';
  import SmartLink from '../generic/SmartLink';
  export default {
    components: {
      SmartLink
    },
    props: {
      value: {
        type: Object,
        default() {
          return {};
        }
      },
      prioritisedLanguages: {
        type: Array,
        default() {
          return ['eng', 'en'];
        }
      }
    },
    computed: {
      // TODO: move to a plugin? or a filter?
      mapContent() {
        const langMap = this.value;

        let listOfValues = [];
        for (let key in langMap) {
          // "und" is the ISO 639-2 code for undetermined language
          const contentLang = (key === 'def' ? 'und' : key);
          for (let singleValue of langMap[key]) {
            if (this.prioritisedLanguages.includes(key)) {
              listOfValues.unshift({ content: singleValue, lang: contentLang });
            } else {
              listOfValues.push({ content: singleValue, lang: contentLang });
            }
          }
        }
        return listOfValues;
      }
    },
    methods: {
      isEntity(value) {
        return !!value && !!value.content && typeof(value.content) === 'object' && Object.prototype.hasOwnProperty.call(value.content, 'about');
      },
      isEntityLink(value) {
        return this.isEntity(value) && isEntityUri(value.content.about);
      }
    }
  };
</script>
