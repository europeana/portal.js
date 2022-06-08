<template>
  <div
    class="page"
  >
    <HomeHero />
    <CallToAction
      v-if="callsToActions[0]"
      :call-to-action="callsToActions[0]"
    />
    <!-- TODO: insert themes here -->
    <CallToAction
      v-if="callsToActions[1]"
      :call-to-action="callsToActions[1]"
    />
    <!-- TODO: insert latest editorial here -->
    <CallToAction
      v-if="callsToActions[2]"
      :call-to-action="callsToActions[2]"
    />
  </div>
</template>

<script>
  import HomeHero from '@/components/home/HomeHero';
  import CallToAction from './CallToAction';

  export default {
    name: 'HomePage',

    components: {
      HomeHero,
      CallToAction
    },

    data() {
      return {
        sections: []
      };
    },

    async fetch() {
      const variables = {
        identifier: this.$route.query.identifier || null,
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };
      const response = await this.$contentful.query('homePage', variables);
      const homePage = response.data.data.homePageCollection.items[0];
      this.sections = homePage.sectionsCollection.items;
    },

    computed: {
      callsToActions() {
        return this.sections.filter(section => section['__typename'] === 'PrimaryCallToAction');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    align-contet: center;
    background-color: white;
    padding-bottom: 1rem;
  }
</style>
