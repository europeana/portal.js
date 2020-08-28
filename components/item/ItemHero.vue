<template>
  <div class="item-hero">
    <AwesomeSwiper
      :europeana-identifier="identifier"
      :media="media"
      @select="selectMedia"
    />
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="col-lg-10 media-bar justify-content-between d-flex mx-auto"
        >
          <RightsStatementButton
            v-if="rightsStatementIsUrl"
            :rights-statement="rightsStatement"
          />
          <span
            v-else
            data-qa="rights statement"
          >
            {{ rightsStatement }}
          </span>
          <div>
            <UserButtons
              v-if="showUserButtons"
              v-model="identifier"
              @like="$emit('like', identifier)"
              @unlike="$emit('unlike', identifier)"
            />
            <ShareButton />
            <DownloadButton
              v-if="downloadEnabled"
              :url="downloadUrl"
            />
          </div>
        </b-col>
      </b-row>
      <SocialShareModal :media-url="selectedMedia.about" />
    </b-container>
  </div>
</template>

<script>
  import AwesomeSwiper from './AwesomeSwiper';
  import DownloadButton from '../generic/DownloadButton.vue';
  import RightsStatementButton from '../generic/RightsStatementButton.vue';
  import SocialShareModal from '../sharing/SocialShareModal.vue';
  import ShareButton from '../sharing/ShareButton.vue';
  import has from 'lodash/has';

  export default {
    components: {
      AwesomeSwiper,
      DownloadButton,
      RightsStatementButton,
      SocialShareModal,
      ShareButton,
      UserButtons: () => import('../account/UserButtons')
    },
    props: {
      identifier: {
        type: String,
        required: true
      },
      edmRights: {
        type: String,
        default: ''
      },
      media: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        selectedMediaItem: null
      };
    },
    computed: {
      downloadUrl() {
        return this.$proxyMedia(this.selectedMedia.about, this.identifier);
      },
      rightsStatementIsUrl() {
        return RegExp('^https?://*').test(this.rightsStatement);
      },
      rightsStatement() {
        if (has(this.selectedMedia, 'webResourceEdmRights')) {
          return this.selectedMedia.webResourceEdmRights.def[0];
        } else if (this.edmRights !== '') {
          return this.edmRights;
        }
        return '';
      },
      selectedMedia: {
        get() {
          return this.selectedMediaItem || this.media[0] || {};
        },
        set(about) {
          this.selectedMediaItem = this.media.find((item) => item.about === about) || {};
        }
      },
      downloadEnabled() {
        return this.rightsStatement && !this.rightsStatement.includes('/InC/');
      },
      showUserButtons() {
        return Boolean(Number(process.env.ENABLE_XX_USER_AUTH));
      }
    },
    methods: {
      selectMedia(about) {
        this.selectedMedia = about;
      }
    }
  };
</script>

