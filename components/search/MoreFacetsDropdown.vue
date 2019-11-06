<template>
  <b-dropdown
    :text="$t('facets.button.morefilters')"
    variant="light"
    no-caret
    class="more-facets position-static"
  >
    <b-dropdown-group class="more-facets-wrapper">
      <b-dropdown-form
        v-for="(facet, index) in moreFacets"
        :key="index"
      >
        <strong
          class="mb-4 d-inline-block"
        >
          {{ $t(`facets.${facet.name}`).name }}
        </strong>
        <div class="option-group">
          <b-form-checkbox
            v-for="(filter, f) in facet.fields"
            :id="filter.label"
            :key="f"
            :value="filter.label"
            :name="filter.label"
            class="mb-3"
            plain
          >
            {{ filter.label }}
            <span
              class="reset"
              :aria-label="$t('facets.button.reset')"
            >
              x
            </span>
          </b-form-checkbox>
        </div>
      </b-dropdown-form>
    </b-dropdown-group>
    <li
      class="dropdown-buttons"
      role="group"
    >
      <b-button
        variant="link"
      >
        {{ $t('facets.button.cancel') }}
      </b-button>
      <b-button
        variant="primary"
      >
        {{ $t('facets.button.apply') }}
      </b-button>
    </li>
  </b-dropdown>
</template>

<script>
  export default {
    props: {
      moreFacets: {
        type: Array,
        default: () => []
      }
    }
  };
</script>

