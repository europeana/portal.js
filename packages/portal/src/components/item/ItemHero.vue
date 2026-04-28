<template functional>
  <div class="item-hero position-relative">
    <slot />
    <b-container>
      <b-row>
        <b-col
          cols="12"
          class="col-lg-10 media-bar d-flex mx-auto justify-content-between"
          data-qa="action bar"
        >
          <div class="rights-wrapper d-inline-flex justify-content-md-center align-items-center mr-2">
            <slot name="buttons-left" />
          </div>
          <div
            class="d-flex justify-content-md-center align-items-center button-wrapper"
          >
            <div class="ml-lg-auto d-flex justify-content-center flex-wrap flex-md-nowrap">
              <slot name="buttons-right" />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'ItemHero'
  };
</script>

<style lang="scss">
  @import '@europeana/style/scss/variables';

  
</style>
