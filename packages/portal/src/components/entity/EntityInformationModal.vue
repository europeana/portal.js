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
          <template v-else-if="Array.isArray(info.value)">
            {{ info.value.join('; ') }}
          </template>
          <template v-else-if="typeof info.value === 'number'">
            {{ $n(info.value) }}
          </template>
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
  import { langMapValueForLocale } from '@europeana/i18n';

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
        default: null
      },
      englishName: {
        type: Object,
        default: null
      }
    },

    computed: {
      entityInfo() {
        const labelledMoreInfo = [];

        if (this.englishName) {
          labelledMoreInfo.push({
            label: this.$t('organisation.englishName'),
            value: Object.values(this.englishName)[0],
            lang: Object.keys(this.englishName)[0]
          });
        }
        if (this.entity?.acronym)  {
          const langMapValue = langMapValueForLocale(this.entity.acronym, this.$i18n.locale);
          labelledMoreInfo.push({ label: this.$t('organisation.nameAcronym'), value: langMapValue.values[0], lang: langMapValue.code });
        }
        // TODO: Update to use API country field?
        if (this.entity?.hasAddress?.countryName)  {
          labelledMoreInfo.push({ label: this.$t('organisation.country'), value: this.entity.hasAddress.countryName });
        }
        if (this.entity?.hasAddress?.locality)  {
          labelledMoreInfo.push({ label: this.$t('organisation.city'), value: this.entity.hasAddress.locality });
        }
        if (this.entity.homepage)  {
          labelledMoreInfo.push({ label: this.$t('website'), value: this.entity.homepage });
        }

        const aggregationInfoFields = ['heritageDomain', 'providesSupportForMediaType', 'geographicScope', 'providesSupportForDataActivity', 'providesCapacityBuildingActivity', 'providesAudienceEngagementActivity'];
        for (const field of aggregationInfoFields) {
          if (this.entity?.[field])  {
            labelledMoreInfo.push({ label: this.$t(`organisation.${field}`), value: this.entity[field] });
          }
        }

        if (this.entity?.isAggregatedBy?.recordCount) {
          labelledMoreInfo.push({ label: this.$t('organisation.recordCount'), value: this.entity.isAggregatedBy.recordCount });
        }

        if (this.$features.aggregatorsTab && this.aggregatesFrom)  {
          labelledMoreInfo.push({ label: this.$t('organisation.providingInstitutionsCount'), value: this.aggregatesFromCount });
        }

        return labelledMoreInfo;
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
