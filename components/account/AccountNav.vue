<template>
  <b-nav
    align="center"
    data-qa="account navigation"
  >
    <li class="nav-item">
      <SmartLink
        :destination="'/account/login'"
        link-class="nav-link"
      >
        <span>{{ $t('account.login.button') }}</span>
      </SmartLink>
    </li>
    <li class="nav-item">
      <SmartLink
        :destination="'/account/create'"
        link-class="nav-link"
      >
        <span>{{ $t('account.create') }}</span>
      </SmartLink>
    </li>
  </b-nav>
</template>
<script>
  import SmartLink from '../../components/generic/SmartLink';

  export default {
    components: {
      SmartLink
    } };
	</script>
<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';
  @import '../../assets/scss/icons.scss';

  .nav-item {
    &:not(:last-child) {
      margin-right: 1rem;
    }

    .nav-link {
      color: $mediumgrey;
      text-decoration: none;
      font-size: $font-size-small;


      &.nuxt-link-active {
		color: $blue;
        &:after {
          content: '';
          position: absolute;
          border-bottom: solid 3px $blue;
          display: block;
          width: 100%;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: -1rem;
        }
      }

      &.is-external-link:after {
        @extend .icon-font;
        content: '\e900';
      }

      span {
        position: relative;
      }
    }

    &:last-child {
      .nav-link {
        &.nuxt-link-active:after {
          left: 0.25rem;
        }
        &:before {
          right: -0.5rem;
        }
      }
    }
    @media (max-width: $bp-large) {
      .nav-link.nuxt-link-active {
        &:after {
          bottom: -1rem;
        }
      }
    }
  }
</style>
