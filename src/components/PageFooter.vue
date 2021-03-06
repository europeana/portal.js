<template>
  <footer
    data-qa="footer"
    class="py-5 px-3"
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
            <figcaption class="text-uppercase font-weight-bold">
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

    fetch() {
      const contentfulVariables = {
        locale: this.$i18n.isoLocale(),
        preview: this.$route.query.mode === 'preview'
      };

      return this.$contentful.query('linkGroups', contentfulVariables)
        .then(response => {
          for (const identifier in response.data.data) {
            const linkGroup = response.data.data[identifier].items[0];
            this[identifier] = {
              name: linkGroup.name ? linkGroup.name : null,
              links: linkGroup.links.items
            };
          }
        })
        .catch(() => null);
    },

    data() {
      return {
        footerMoreInfo: null,
        footerHelp: null,
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
      }
    },

    watch: {
      '$i18n.locale': '$fetch'
    }
  };
</script>
