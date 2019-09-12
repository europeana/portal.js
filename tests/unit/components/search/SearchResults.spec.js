// import { createLocalVue, shallowMount } from '@vue/test-utils';
// import BootstrapVue from 'bootstrap-vue';
// import SearchResults from '../../../../components/search/SearchResults.vue';
//
// const localVue = createLocalVue();
// localVue.use(BootstrapVue);
//
// const factory = () => shallowMount(SearchResults, {
//   localVue,
//   mocks: {
//     localePath: (opts) => `/record/${opts.params.pathMatch}`
//   }
// });
//
// describe('components/search/SearchResults', () => {
//   context('with `error` prop', () => {
//     it('displays the message in AlertMessage', () => {
//       const wrapper = factory();
//       const error = 'Something went very wrong';
//
//       wrapper.setProps({ error });
//       console.log('currentSelectedFacets: ' + wrapper.$vm.currentSelectedFacets);
//       const alertMessage =  wrapper.find('AlertMessage');
//
//       alertMessage.attributes().error.should.eq(error);
//     });
//   });
// });
