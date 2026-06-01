<template>
  <b-modal
    id="entityInformationModal"
    :static="modalStatic"
    hide-footer
    hide-header-close
  >
    <template #modal-title>
      <span :lang="langAttribute(title.code)">
        {{ title.values[0] }}
      </span>
    </template>
    <ul class="mb-2 p-0">
      <li
        v-for="(info, index) in entityInfo"
        :key="index"
        class="entity-data-row d-flex flex-wrap justify-content-between"
        :data-qa="`${info.label} field`"
      >
        <span>
          {{ info.label }}
        </span>
        <span
          class="semibold"
          :lang="langAttribute(info.lang)"
        >
          <b-link
            v-if="isUrl(info.value)"
            :href="info.value"
            target="_blank"
          >
            {{ info.value }}
          </b-link>
          <template v-else>
            {{ info.value }}
          </template>
        </span>
      </li>
    </ul>
    <div
      v-if="$features.aggregatorsTab && aggregatesFrom"
      class="mb-4 ml-sm-3"
    >
      <EntityBadges
        :entity-uris="aggregatesFromForDisplay"
        :show-title="false"
      />
      <b-button
        :href="aggregatorPageLink.link"
        variant="link"
        class="view-all-button p-0"
      >
        {{ aggregatorPageLink.text }}
      </b-button>
    </div>
    <b-button
      variant="outline-primary"
      @click="$bvModal.hide('entityInformationModal')"
    >
      {{ $t('actions.close') }}
    </b-button>
  </b-modal>
</template>

<script>
  import langAttributeMixin from '@/mixins/langAttribute';
  import { isLangMap, langMapValueForLocale } from '@europeana/i18n';

  export default {
    name: 'EntityInformationModal',

    components: {
      EntityBadges: () => import('./EntityBadges')
    },

    mixins: [langAttributeMixin],

    props: {
      modalStatic: {
        type: Boolean,
        default: false
      },
      title: {
        type: Object,
        default: null
      },
      entity: {
        type: Object,
        required: true
      },
      // TODO: should this be derived instead of passed in?
      englishName: {
        type: Object,
        default: null
      }
    },

    computed: {
      entityInfo() {
        const fieldData = {
          'organisation.englishName': this.englishName,
          'organisation.nameAcronym': this.entity.acronym,
          // TODO: Update to use API country field?
          'organisation.country': this.entity.hasAddress?.countryName,
          'organisation.city': this.entity.hasAddress.locality,
          'website': this.entity.homepage,
          'organisation.heritageDomain': this.entity.heritageDomain,
          'organisation.providesSupportForMediaType': this.entity.providesSupportForMediaType,
          'organisation.geographicScope': this.entity.geographicScope,
          'organisation.providesSupportForDataActivity': this.entity.providesSupportForDataActivity,
          'organisation.providesCapacityBuildingActivity': this.entity.providesCapacityBuildingActivity,
          'organisation.providesAudienceEngagementActivity': this.entity.providesAudienceEngagementActivity,
          'organisation.recordCount': this.entity.isAggregatedBy?.recordCount,
          'organisation.providingInstitutionsCount': this.$features.aggregatorsTab ? this.aggregatesFromCount : undefined
        };

        return Object.keys(fieldData)
          .map((key) => ({ label: this.$t(key), value: fieldData[key] }))
          .filter((info) => info.value)
          .map((info) => {
            if (isLangMap(info.value)) {
              const langMapValue = langMapValueForLocale(info.value, this.$i18n.locale);
              info.value = langMapValue.values[0];
              info.lang = langMapValue.code;
            }

            if (Array.isArray(info.value)) {
              info.value = info.value.join('; ');
            } else if (typeof info.value === 'number') {
              info.value = this.$n(info.value);
            }

            return info;
          });
      },
      aggregatesFrom() {
        return this.entity.aggregatesFrom;
      },
      aggregatesFromForDisplay() {
        return this.entity.aggregatesFrom.slice(0, 4);
      },
      aggregatesFromCount() {
        return this.aggregatesFrom?.length;
      },
      entityId() {
        return this.entity.id.toString().split('/').pop();
      },
      aggregatorPageLink() {
        return {
          link: `/collections/organisations#aggregators-${this.entityId}`,
          text: this.$t('actions.viewAll', { count: this.aggregatesFromCount })
        };
      }
    },

    methods: {
      isUrl(value) {
        return /^https?:\/\//.test(value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@europeana/style/scss/variables';

  .entity-data-row {
    border-bottom: 1px solid $lightgrey;
    padding: 1rem 0;
    list-style: none;

    &:last-child {
      border-bottom: none;
    }

    .semibold {
      font-weight: 600;
    }
  }

  .view-all-button.btn-link:hover {
    text-decoration: none;
  }
</style>
