<template>
  <div
    ref="banner"
    :class="{ 'is-open' : isOpen }"
    :style="bottomPosition"
    class="cookie-disclaimer py-4"
    data-qa="cookie disclaimer"
  >
    <b-container>
      <b-row>
        <b-col class="col-12">
          <div class="cookie-disclaimer-inner">
            <p class="mb-0">
              {{ $t('cookieDisclaimer.terms') }}
              <SmartLink
                class="more-info"
                destination="https://www.europeana.eu/portal/en/rights.html"
              >
                {{ $t('cookieDisclaimer.link') }}
              </SmartLink>
            </p>
            <span
              class="accept-btn icon-close"
              :aria-label="$t('cookieDisclaimer.acceptCookieDisclaimer')"
              data-qa="cookie disclaimer button"
              @click="accept"
            />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import * as tinyCookie from 'tiny-cookie';
  import SmartLink from '../generic/SmartLink';

  export default {
    name: 'CookieDisclaimer',

    components: {
      SmartLink
    },

    data() {
      return {
        supportsLocalStorage: true,
        isOpen: false,
        COOKIE_CONSENT: 'cookie_consent',
        bannerHeight: 0
      };
    },

    computed: {
      bottomPosition() {
        return !this.isOpen ? `bottom: -${this.bannerHeight}px` : '';
      }
    },

    mounted() {
      this.checkLocalStorageFunctionality();
      this.init();
    },

    methods: {
      init() {
        const status = this.getCookieStatus();

        if (!status) {
          this.isOpen = true;
        }

        this.setBannerHeight();
        window.addEventListener('resize', this.setBannerHeight);
      },

      setBannerHeight() {
        this.bannerHeight = this.$refs.banner.getBoundingClientRect().height;
      },

      accept() {
        this.setCookieStatus();
        this.isOpen = false;
      },

      checkLocalStorageFunctionality() {
        // Check for availability of localStorage
        try {
          const test = 'cookie_consent_check_localStorage';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
        } catch (e) {
          // Local storage is not supported, falling back to cookie use
          this.supportsLocalStorage = false;
        }
      },

      setCookieStatus() {
        if (this.supportsLocalStorage) {
          localStorage.setItem(this.COOKIE_CONSENT, 'accepted');
        } else {
          tinyCookie.set(this.COOKIE_CONSENT, 'accepted');
        }
      },

      getCookieStatus() {
        if (this.supportsLocalStorage) {
          return localStorage.getItem(this.COOKIE_CONSENT);
        }
        return tinyCookie.get(this.COOKIE_CONSENT);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';

  .cookie-disclaimer {
    transition: all .4s ease;
    position: fixed;
    background-color: $innovationblue;
    width: 100%;
    color: $white;
    z-index: 1000;
    font-size: $font-size-small;
    opacity: 0;

    &.is-open {
      opacity: 1;
      bottom: 0px;
    }
  }

  .cookie-disclaimer-inner {
    display: flex;

    .accept-btn {
      transition: all .4s ease;
      font-size: 1.5rem;
      padding: 0 1rem;
      align-items: center;
      justify-content: center;
      display: flex;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }
    }

    .more-info {
      color: $white;
    }
  }
</style>
