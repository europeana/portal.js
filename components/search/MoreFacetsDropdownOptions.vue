<template>
  <b-dropdown-form>
    <strong
      class="mb-4 d-inline-block"
    >
      {{ $tc(`facets.${facet.name}.name`, 1) }}
    </strong>
    <b-form-checkbox-group
      class="option-group"
      plain
    >
      <b-form-checkbox
        v-for="(filter, index) in [].concat(facet.fields).splice(0, limitTo)"
        :key="index"
        :value="filter.label"
        :name="filter.label"
        :data-qa="`${$tc(`facets.${facet.name}.name`, 1)} checkbox`"
        class="mb-3"
      >
        {{ filter.label }}
        <span
          class="reset icon-close"
          :aria-label="$t('facets.button.reset')"
        />
      </b-form-checkbox>
      <div
        v-if="facet.fields.length > limitTo && isActive"
        class="option-group"
      >
        <b-form-checkbox
          v-for="(filter, index) in [].concat(facet.fields).splice(limitTo)"
          :key="index"
          :value="filter.label"
          :name="filter.label"
          :data-qa="`${$tc(`facets.${facet.name}.name`, 1)} checkbox`"
          class="mb-3"
        >
          {{ filter.label }}
          <span
            class="reset icon-close"
            :aria-label="$t('facets.button.reset')"
          />
        </b-form-checkbox>
      </div>
    </b-form-checkbox-group>
    <button
      v-if="facet.fields.length > limitTo"
      type="button"
      class="btn btn-link btn-toggle"
      :class="{ 'is-active': isActive }"
      :data-qa="(isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${facet.name}.name`, 2) }) + ' button' : $t(`facets.button.showAll`, { label: $tc(`facets.${facet.name}.name`, 2) }) + ' button')"
      @click.prevent="isActive = !isActive"
    >
      {{ isActive ? $t(`facets.button.showLess`, { label: $tc(`facets.${facet.name}.name`, 2) }) : $t(`facets.button.showAll`, { label: $tc(`facets.${facet.name}.name`, 2) }) }}
    </button>
  </b-dropdown-form>
</template>

<script>
  export default {
    props: {
      facet: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        isActive: false,
        limitTo: 9
      };
    }
  };
</script>
