/*
 * @file Presentation of "LangMap" data type in metadata
 * @see {@link https://pro.europeana.eu/page/europeana-rest-api#getting-started|Datatypes}
 */
<template>
  <ul>
    <li
      v-for="mapValue in mapContent"
      :key="mapValue.lang"
      :lang="mapValue.lang"
    >
      {{ mapValue.content }} ({{ mapValue.lang }})
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        default: function() {
          return {};
        }
      },
      prioritisedLanguages: {
        type: Array,
        default: function() {
          return ['eng', 'en'];
        }
      }
    },
    computed: {
      mapContent: function() {
        const langMap = this.value;

        let listOfValues = [];
        for (let key in langMap) {
          // "und" is the ISO-639-2 code for "undetermined"
          const contentLang = key == 'def' ? 'und' : key;
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
    }
  };
</script>
