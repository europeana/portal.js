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
            Our mission
          </h5>
          <p class="font-italic mb-0">
            We transform the world with culture! We want to build on Europe's rich heritage and make it easier for people to use, whether for work, for learning or just for fun.
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
                More Info
              </h5>
              <ul class="footer-link-list m-0 p-0 pb-lg-5">
                <li
                  v-for="(footerLink, index) in footerMoreInfo"
                  :key="index"
                >
                  <template
                    v-if="footerLink.url"
                  >
                    <SmartLink
                      :destination="footerLink.url"
                      link-class="footer-link"
                    >
                      {{ footerLink.text }}
                    </SmartLink>
                  </template>
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
                Help
              </h5>
              <ul class="footer-link-list m-0 p-0">
                <li
                  v-for="(footerLink, index) in footerHelp"
                  :key="index"
                >
                  <template
                    v-if="footerLink.url"
                  >
                    <SmartLink
                      :destination="footerLink.url"
                      link-class="footer-link"
                    >
                      {{ footerLink.text }}
                    </SmartLink>
                  </template>
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
            Customise website language
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
              alt="Co-financed by the Connecting Europe Facility of the European Union"
              class="mb-3"
            >
            <p>Europeana is an initiative of the European Union, financed by the European Union’s Connecting Europe Facility and European Union Member States. The Europeana services, including this website, are operated by a consortium led by the Europeana Foundation under a service contract with the European Commission.</p>

            <p>The European Commission does not guarantee the accuracy of the information and accepts no responsibility or liability whatsoever with regard to the information on this website. Neither the European Commission, nor any person acting on the European Commission’s behalf, is responsible or liable for the accuracy or use of the information on this website.</p>
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
