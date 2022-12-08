<template>
  <b-button
    :variant="publishedSet ? 'secondary' : 'primary'"
    class="text-decoration-none ml-2"
    data-qa="publish set button"
    @click="togglePublishedSet"
  >
    {{ publishedSet ? $t('actions.depublish') : $t('actions.publish') }}
  </b-button>
</template>

<script>
  import makeToastMixin from '@/mixins/makeToast';
  import axios from 'axios';

  export default {
    name: 'PublishSetButton',

    mixins: [makeToastMixin],

    props: {
      /**
       * Id of the set
       */
      setId: {
        type: String,
        required: true
      },
      /**
       * Active visibility status: public, private or published
       */
      visibility: {
        type: String,
        default: 'public'
      }
    },

    computed: {
      publishedSet() {
        return this.visibility === 'published';
      }
    },

    methods: {
      async togglePublishedSet() {
        const visibilityWas = this.visibility;
        await this.$store.dispatch('set/fetchActive', this.setId);
        if (visibilityWas === this.$store.state.set.active.visibility) {
          if (this.publishedSet) {
            this.$store.dispatch('set/unpublish', this.setId);
          } else {
            this.$store.dispatch('set/publish', this.setId);
            this.transitionJiraIssue();
          }
        } else {
          this.makeToast(this.$t('set.notifications.visibilityChanged', { visibility: this.$store.state.set.active.visibility }), {
            variant: 'warning'
          });
        }
      },
      async transitionJiraIssue() {
        const relatedJiraIssues = await this.getJiraIssueIdsBySetId();

        console.log(relatedJiraIssues);

        relatedJiraIssues &&
          relatedJiraIssues.forEach(async issueId => {
            const postData = { issueId,
                               transition:
                                 { transition: { id: '231' }, fields: { resolution: { name: 'Published' } } } };

            await axios.post(
              '/_api/jira/galleries/transition-issue',
              postData,
              { baseURL: this.$config.app.baseUrl }
            );
          });
      },
      async getJiraIssueIdsBySetId() {
        const jqlQuery = `project=UGP AND cf[10841]~"${this.setId}"`;
        const jiraIssues = await axios.get(
          '/_api/jira/galleries/get-issues',
          { baseURL: this.$config.app.baseUrl,
            params: {
              jql: jqlQuery,
              fields: 'id'
            } }
        );

        const jiraIssueIds = jiraIssues?.data?.issues?.map(issue => issue.id);
        if (jiraIssueIds && jiraIssueIds.length) {
          return jiraIssueIds;
        } else {
          console.log('No jira issues were found');
          return null;
        }
      }
    }
  };
</script>

<docs lang="md">
  ```jsx
  <PublishSetButton
    set-id="001"
    :visibility="$store.state.set.active.visibility"
  />
  ```
</docs>
