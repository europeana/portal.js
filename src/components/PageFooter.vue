<template>
  <footer
    data-qa="footer"
    class="page-footer py-5 px-3"
  >
    <b-container>
      <b-row>
        <b-col
          lg="5"
          class="pb-4"
        >
          <figure>
            <figcaption class="text-uppercase font-weight-bold">
              {{ $t('footer.ourMission') }}
            </figcaption>
            <p class="font-italic mb-0">
              {{ $t('footer.ourMissionQuote') }}
            </p>
          </figure>
          <LinkGroup
            list-class="footer-link-list social-links"
            link-class="footer-link"
            :caption="$t('footer.findUsElsewhere')"
            :links="social"
          />
        </b-col>
        <b-col
          lg="4"
          class="pb-4"
        >
          <b-row>
            <b-col
              cols="6"
              lg="12"
            >
              <LinkGroup
                v-if="footerMoreInfo"
                list-class="footer-link-list"
                link-class="footer-link"
                :caption="footerMoreInfo.name"
                :links="footerMoreInfo.links"
              />
            </b-col>
            <b-col
              cols="6"
              lg="12"
            >
              <LinkGroup
                v-if="footerHelp"
                list-class="footer-link-list"
                link-class="footer-link"
                :caption="footerHelp.name"
                :links="footerHelp.links"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="3">
          <figure>
            <figcaption class="text-uppercase font-weight-bold pr-2">
              {{ $t('footer.customiseWebsiteLanguage') }}
            </figcaption>
            <LangSelector data-qa="language selector" />
          </figure>

          <DebugMenu
            v-if="showDebugMenu"
            data-qa="debug menu"
          />
        </b-col>
      </b-row>
      <hr class="my-5">
      <b-row>
        <b-col lg="6">
          <div class="sub-footer">
            <img
              width="250"
              height="26"
              src="../assets/img/eu-funding.svg"
              class="mb-3"
              :alt="$t('footer.imageDescription')"
            >
            <p>{{ $t('footer.disclaimerLine1') }}</p>

            <p>{{ $t('footer.disclaimerLine2') }}</p>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex';

  import LangSelector from './generic/LanguageSelector';
  import LinkGroup from './generic/LinkGroup';

  export default {
    components: {
      DebugMenu: () => import('./debug/DebugMenu'),
      LangSelector,
      LinkGroup
    },

    data() {
      return {
        social: [
          {
            text: 'Facebook',
            url: 'https://www.facebook.com/Europeana',
            icon: 'icon-facebook'
          },
          {
            text: 'Twitter',
            url: 'https://twitter.com/europeanaeu',
            icon: 'icon-twitter'
          },
          {
            text: 'Pinterest',
            url: 'https://www.pinterest.com/europeana',
            icon: 'icon-pinterest'
          },
          {
            text: 'Instagram',
            url: 'https://www.instagram.com/europeana_eu/',
            icon: 'icon-instagram'
          }
        ]
      };
    },

    computed: {
      ...mapGetters({
        debugSettings: 'debug/settings'
      }),

      showDebugMenu() {
        return !!this.debugSettings.apiRequests;
      },
      footerMoreInfo() {
        return { name: this.$t('footer.navigation.MoreInfoLabel'),
                 links: [
                   { url: '/about-us', text: this.$t('footer.navigation.about') },
                   { url: '/for-developers', text: this.$t('footer.navigation.forDevelopers') },
                   { url: 'https://pro.europeana.eu/services/data-publication-services', text: this.$t('footer.navigation.provide') },
                   { url: 'https://europeana.us3.list-manage.com/subscribe?u=ad318b7566f97eccc895e014e&id=1d4f51a117', text: this.$t('footer.navigation.subscribe') }
                 ] };
      },
      footerHelp() {
        return { name: this.$t('footer.navigation.help'),
                 links: [
                   { url: '/help', text: this.$t('footer.navigation.help') },
                   { url: '/rights', text: this.$t('footer.navigation.terms') },
                   { url: '/rights/privacy-policy', text: this.$t('footer.navigation.privacy') },
                   { url: '/rights/accessibility-policy', text: this.$t('footer.navigation.accessibility') },
                   { url: '/rights/cookies-policy', text: this.$t('footer.navigation.cookies') }
                 ] };
      }
    }
  };
</script>
