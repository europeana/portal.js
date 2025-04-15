<template>
  <div
    class="xxl-page page"
  >
    <b-container fluid>
      <UserHeader />
      <b-row>
        <b-col class="p-0 mb-3">
          <b-container>
            <b-row>
              <b-col>
                <hr>
                <NuxtLink
                  :to="localePath('/account')"
                >
                  🡠 {{ $t('account.title') }}
                </NuxtLink>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import UserHeader from '@/components/user/UserHeader';
  import pageMetaMixin from '@/mixins/pageMeta';

  export default {
    name: 'AccountAPIKeysPage',

    components: {
      UserHeader
    },

    mixins: [
      pageMetaMixin
    ],

    middleware: 'auth',

    computed: {
      pageMeta() {
        return {
          title: this.$t('apiKeys.title')
        };
      }
    }
  };
</script>
