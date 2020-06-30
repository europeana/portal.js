<template>
  <div class="mt-n3">
    <b-container
      fluid
    >
      <b-row class="bg-white">
        <b-col class="pt-5 pb-4">
          <h1 class="text-center mb-1">
            <!-- TODO: When the connection with Keycloak is done, here show the user's username -->
            @username
          </h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-0">
          <b-tabs
            card
            align="center"
          >
            <b-tab
              :title="$t('account.likes')"
              active
            >
              <b-card-text
                text-tag="div"
              >
                <!-- TODO: Update this section to preview the results retrieved with Sets API -->
                <div class="card-grid text-center">
                  Placeholder for {{ $t('account.likes') }} tab.
                </div>
              </b-card-text>
            </b-tab>
            <b-tab
              :title="$t('account.publicCollections')"
            >
              <b-card-text
                text-tag="div"
              >
                <!-- TODO: Update this section to preview the results retrieved with Sets API -->
                <div class="text-center">
                  Placeholder for {{ $t('account.publicCollections') }} tab.
                </div>
              </b-card-text>
            </b-tab>
            <b-tab
              :title="$t('account.privateCollections')"
            >
              <b-card-text
                text-tag="div"
              >
                <!-- TODO: Update this section to preview the results retrieved with Sets API -->
                <div class="text-center">
                  Placeholder for {{ $t('account.privateCollections') }} tab.
                </div>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    head() {
      return {
        title: this.$t('account.text')
      };
    }
  };

</script>
