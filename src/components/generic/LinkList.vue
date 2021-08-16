<template>
  <section>
    <h2
      v-if="title"
      class="is-size-3 text-uppercase"
      data-qa="link list title"
    >
      {{ title }}
    </h2>
    <b-list-group
      deck
      data-qa="link list"
    >
      <SmartLink
        v-for="item in filteredLinkList"
        :key="item.identifier"
        :style="item.background ? `background-image: url(${item.background})` : null"
        class="item w-100 text-left d-flex justify-content-start align-items-start"
        :destination="item.url"
        :data-qa="`link list ${item.identifier} item`"
      >
        <span class="number" />
        <span>{{ item.text }}</span>
      </SmartLink>
    </b-list-group>
  </section>
</template>

<script>
  import SmartLink from '../../components/generic/SmartLink';
  export default {
    components: {
      SmartLink
    },
    props: {
      title: {
        type: String,
        default: null
      },
      items: {
        type: Array,
        required: true
      }
    },

    computed: {
      filteredLinkList() {
        if (!this.items) {
          return false;
        }
        return this.items.filter(listItem => listItem !== null);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/variables.scss';

  section {
    counter-reset: items;
  }

  h2 {
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .item {
    border: 0;
    font-size: 1.125rem;
    font-weight: normal;
    margin-bottom: 0.5rem;
    padding: 1rem 2rem;
    position: relative;
    text-transform: none;

    background-size: cover;
    border-radius: $border-radius;

    text-decoration: none;
    background-color: $offwhite;
    color: $black;

    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
      box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.15);
      color: $white;
    }
    &[style^='background-image'] {
      background-color: rgba(0, 0, 0, 0.7);
      color: $white;
      &:after {
        content: '';
        background: rgba(0, 0, 0, 0.7);
        border-radius: $border-radius;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    }

    span {
      position: relative;
      z-index: 2;
    }
    .number {
      margin-right: 1.5rem;
      &:before {
        counter-increment: items;
        content: counter(items, decimal-leading-zero);
        display: inline-block;
      }
    }

    &.nuxt-link-active {
      &, &:last-of-type {
        background-color: $blue;
        background-image: none !important;
        color: $white;
        &:after {
          display: none;
        }
      }
    }
  }
</style>
