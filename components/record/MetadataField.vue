<template>
  <div
    v-if="hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
  >
    <div data-qa="label">
      <strong>{{ $t(`fieldLabels.${context}.${name}`) }}</strong>
    </div>
    <ul>
      <template
        v-for="(value, index) of langMappedValues.values"
      >
        <template
          v-if="value.about"
        >
          <EntityField
            v-for="(nestedValue, nestedIndex) of value.values"
            :key="index + '_' + nestedIndex"
            :value="nestedValue"
            :about="value.about"
            :locale="value.code"
            data-qa="entity value"
          />
        </template>
        <li
          v-else-if="langMappedValues.code !== null"
          :key="index"
          :lang="langMappedValues.code"
          data-qa="value"
        >
          {{ value }}
        </li>
        <li
          v-else
          :key="index"
          data-qa="value"
        >
          {{ value }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  import { langMapValueForLocale } from  '../../plugins/europeana/utils';
  import EntityField from './EntityField';

  export default {
    components: {
      EntityField
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      fieldData: {
        type: [String, Object, Array],
        default: null
      },
      context: {
        type: String,
        default: 'default'
      }
    },
    computed: {
      langMappedValues() {
        if (this.fieldData === null) {
          return null;
        } else if (typeof(this.fieldData) === 'string') {
          return { values: [this.fieldData], code: '' };
        } else if (Array.isArray(this.fieldData)) {
          return { values: this.fieldData, code: '' };
        }
        return langMapValueForLocale(this.fieldData, this.$i18n.locale);
      },
      hasValuesForLocale() {
        if (this.langMappedValues === null) {
          return null;
        }
        return this.langMappedValues.values.length >= 1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
    padding: 0;
    li {
      display: inline;
      &:not(:last-child):after {
        content: ';';
      }
    }
  }
</style>
