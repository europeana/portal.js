<template>
  <div
    v-if="hasValuesForLocale"
    :data-field-name="name"
    data-qa="metadata field"
  >
    <label data-qa="label">
      {{ $t(`fieldLabels.${context}.${name}`) }}
    </label>
    <ul>
      <template
        v-for="(value, index) of langMappedValues.values"
      >
        <template
          v-if="value.about"
        >
          <li
            v-for="(nestedValue, nestedIndex) of value.values"
            :key="index + '_' + nestedIndex"
            :lang="value.code"
            data-qa="entity value"
          >
            <EntityField
              :value="nestedValue"
              :about="value.about"
            />
          </li>
        </template>
        <li
          v-else
          :key="index"
          :lang="langMappedValues.code"
          data-qa="literal value"
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
  label {
    font-weight: bold;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      display: inline;
      &:not(:last-child):after {
        content: ';';
        padding: 0 0.2rem;
      }
    }
  }
</style>
