<template>
  <b-dropdown-form>
    <strong
      class="mb-4 d-inline-block"
    >
      {{ $t(`facets.${facet.name}`).name }}
    </strong>
    <b-form-checkbox-group
      class="option-group"
      plain
    >
      <b-form-checkbox
        v-for="(filter, i) in [].concat(facet.fields).splice(0, limitTo)"
        :id="`${$t(`facets.${facet.name}`).name} - ${filter.label}`"
        :key="i"
        :value="filter.label"
        :name="filter.label"
        :data-qa="`${$t(`facets.${facet.name}`).name} checkbox`"
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
          v-for="(filter, i) in [].concat(facet.fields).splice(limitTo)"
          :id="`${$t(`facets.${facet.name}`).name} - ${filter.label}`"
          :key="i"
          :value="filter.label"
          :name="filter.label"
          :data-qa="`${$t(`facets.${facet.name}`).name} checkbox`"
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
      :data-qa="(isActive ? $t(`facets.button.showLess`, { label: $t(`facets.${facet.name}`).plural }) + ' button' : $t(`facets.button.showAll`, { label: $t(`facets.${facet.name}`).plural }) + ' button')"
      @click.prevent="isActive = !isActive"
    >
      {{ isActive ? $t(`facets.button.showLess`, { label: $t(`facets.${facet.name}`).plural }) : $t(`facets.button.showAll`, { label: $t(`facets.${facet.name}`).plural }) }}
    </button>
  </b-dropdown-form>
</template>

<script>
  export default {
    props: {
      index: {
        type: Number,
        required: true
      },
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
