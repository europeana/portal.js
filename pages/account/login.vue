<template>
  <div class="account">
    <b-container fluid>
      <b-row class="bg-white">
        <b-col class="mt-4 mb-3 pt-4">
          <h1 class="text-center mb-5">
            {{ $t('account.text') }}
          </h1>
          <AccountNav />
        </b-col>
      </b-row>
      <b-row class="p-3 mb-4">
        <LoginInterface />
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import LoginInterface from '../../components/account/LoginInterface';
  import AccountNav from '../../components/account/AccountNav';

  export default {
    components: {
      AccountNav,
      LoginInterface
    }
  };
</script>
<style lang="scss" scoped>
	div.account {
			position: relative;
			top: -1.2em;
		}
</style>

