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
          <h5 class="text-uppercase font-weight-bold">
            {{ $t('footer.ourMission') }}
          </h5>
          <p class="font-italic mb-0">
            {{ $t('footer.ourMissionQuote') }}
          </p>
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
              <h5 class="text-uppercase font-weight-bold">
                {{ $t('footer.moreInfo') }}
              </h5>
              <ul class="footer-link-list m-0 p-0 pb-lg-5">
                <li
                  v-for="(footerLink, index) in footerMoreInfo"
                  :key="index"
                >
                  <SmartLink
                    v-if="footerLink.url"
                    :destination="footerLink.url"
                    link-class="footer-link"
                  >
                    {{ footerLink.text }}
                  </SmartLink>
                  <p v-else>
                    {{ footerLink.text }}
                  </p>
                </li>
              </ul>
            </b-col>
            <b-col
              col="6"
              lg="12"
            >
              <h5 class="text-uppercase font-weight-bold">
                {{ $t('footer.help') }}
              </h5>
              <ul class="footer-link-list m-0 p-0">
                <li
                  v-for="(footerLink, index) in footerHelp"
                  :key="index"
                >
                  <SmartLink
                    v-if="footerLink.url"
                    :destination="footerLink.url"
                    link-class="footer-link"
                  >
                    {{ footerLink.text }}
                  </SmartLink>
                  <p v-else>
                    {{ footerLink.text }}
                  </p>
                </li>
              </ul>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="3">
          <h5 class="text-uppercase font-weight-bold">
            {{ $t('footer.customiseWebsiteLanguage') }}
          </h5>
          <LangSelector data-qa="language selector" />
        </b-col>
      </b-row>
      <hr class="my-5">
      <b-row>
        <b-col lg="6">
          <div class="sub-footer">
            <img
              width="250"
              src="../assets/img/eu-flag.svg"
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
  import SmartLink from './generic/SmartLink';
  import LangSelector from './generic/LanguageSelector';

  export default {
    components: {
      SmartLink,
      LangSelector
    },
    computed: {
      footerMoreInfo() {
        return this.$store.state['link-group'].links.footerMoreInfo;
      },
      footerHelp() {
        return this.$store.state['link-group'].links.footerHelp;
      }
    }
  };
</script>
