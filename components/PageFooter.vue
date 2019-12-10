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
        </b-col>
        <b-col
          lg="4"
          class="pb-4"
        >
          <b-row>
            <b-col
              col="6"
              lg="12"
            >
              <LinkGroup
                list-class="footer-link-list"
                link-class="footer-link"
                :caption="footerMoreInfo.name"
                :links="footerMoreInfo.links"
              />
            </b-col>
            <b-col
              col="6"
              lg="12"
            >
              <LinkGroup
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
  import LangSelector from './generic/LanguageSelector';
  import LinkGroup from './generic/LinkGroup';

  export default {
    components: {
      LangSelector,
      LinkGroup
    },
    computed: {
      footerMoreInfo() {
        return this.$store.state['link-group'].data.footerMoreInfo;
      },
      footerHelp() {
        return this.$store.state['link-group'].data.footerHelp;
      }
    }
  };
</script>
