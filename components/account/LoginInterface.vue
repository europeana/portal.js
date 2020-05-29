<template>
  <b-container>
    <b-row
      align-h="center"
    >
      <b-col
        class="p-4 m-4 bg-white"
        cols="6"
      >
        <div class="mb-4 text-center">
          <p>
            {{ $t('account.login.text') }}
          </p>
        </div>
        <b-form
          method="post"
          @submit.prevent="login"
        >
          <b-form-group
            id="email-group"
            label-for="email"
          >
            <div class="wrapper">
              <b-form-input
                id="email"
                v-model="email"
                type="email"
                required
                class="wrapper"
              />
              <template>
                <label>
                  {{ $t('account.email.text') }}
                </label>
              </template>
            </div>
          </b-form-group>
          <b-form-group
            id="password-group"
            label-for="password"
            class="sm"
          >
            <div class="wrapper">
              <b-form-input
                id="password"
                v-model="password"
                type="password"
                autocomplete="on"
                required
              />
              <template>
                <label>
                  {{ $t('account.password.text') }}
                </label>
              </template>
            </div>
          </b-form-group>

          <div class="d-flex">
            <div class="p-2 flex-grow-1">
              <b-button
                type="button"
                variant="outline-primary"
              >
                {{ $t('account.password.forgot') }}
              </b-button>
            </div>
            <div class="p-2 flex">
              <b-button
                type="submit"
                variant="primary"
                :disabled="!email || !password"
              >
                {{ $t('account.login.button') }}
              </b-button>
            </div>
          </div>
        </b-form>
      </b-col>
    </b-row>
    <b-row
      v-if="error"
      class="m-4"
    >
      <b-col>
        <AlertMessage
          :error="error"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import AlertMessage from '../../components/generic/AlertMessage';

  export default {
    name: 'LoginInterface',
    components: {
      AlertMessage
    },

    data() {
      return {
        email: '',
        password: '',
        error: null
      };
    },
    methods: {
      async login() {
        try {
          this.$router.push('');
        } catch (e) {
          this.error = e.response.data.message;
          console.log(this.error);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/variables.scss';


  .btn-outline-primary {
    text-transform: none;
  }

  div.form-group {
    font-size: $font-size-small;

    div.wrapper {
      display: flex;
      flex-direction: column-reverse;
      margin-bottom: 15px;
    }

    label {
      transition: all 0.3s ease;
      display: inline-block;
      margin-bottom: 5px;
    }

    input {
      transition: all 0.3s ease;
      border: 1px solid #767676;
      display: block;
      padding: 8px 14px;
      width: 100%;
      box-shadow: none;
      background-color: white;

      &:focus {
        outline: none;
        border-color: #2d8cf0;

        +label {
          color: #2d8cf0;
        }
      }
    }
  }

</style>
