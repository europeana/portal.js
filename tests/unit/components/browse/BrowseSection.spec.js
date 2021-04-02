// import { createLocalVue, mount } from '@vue/test-utils';
// import BootstrapVue from 'bootstrap-vue';
// import BrowseSections from '../../../../src/components/browse/BrowseSections.vue';

// const localVue = createLocalVue();
// localVue.use(BootstrapVue);

// const $store = {
//   state: {
//     request: {
//       domain: null
//     }
//   }
// };

// const factory = () => mount(BrowseSections, {
//   localVue,
//   mocks: {
//     $t: () => {},
//     $store
//   }
// });

// const dummySection = [{
//   sys: {
//     id: '12345',
//     contentType: {
//       sys: {
//         id: 'cardGroup'
//       }
//     }
//   },
//   fields: {
//     hasPart: [
//       {
//         sys: { id: '123' },
//         fields: { name: 'Card one title', description: 'the first card', url: 'http://europeana.eu', image: {
//           fields: { file: { url: 'img/landscape.jpg' } } }
//         }
//       },
//       {
//         sys: { id: '456' },
//         fields: { name: 'Card two title', description: 'the second card', url: 'http://europeana.eu', image: {
//           fields: { file: { url: 'img/portrait.jpg' } } }
//         }
//       }
//     ]
//   }
// }];

// const dummySectionRichText = [{
//   sys: {
//     id: '45678',
//     contentType: {
//       sys: {
//         id: 'richText'
//       }
//     }
//   },
//   fields: {
//     headline: 'Rich Text Title',
//     text: 'Rich Text Content'
//   }
// }];

// describe('components/browse/BrowseSections', () => {
//   it('shows a section with cards', () => {
//     const wrapper = factory();
//     wrapper.setProps({ sections: dummySection });

//     wrapper.findAll('[data-qa="browse section"]').length.should.eq(1);
//   });

//   it('shows a section with rich text', () => {
//     const wrapper = factory();
//     wrapper.setProps({ sections: dummySectionRichText });

//     wrapper.findAll('[data-qa="markdown"]').length.should.eq(1);
//   });

//   it('shows a section with cards and a rich text section', () => {
//     const wrapper = factory();
//     wrapper.setProps({ sections: dummySection.concat(dummySectionRichText) });

//     wrapper.findAll('[data-qa="browse section"]').length.should.eq(1);
//     wrapper.findAll('[data-qa="markdown"]').length.should.eq(1);
//   });

//   it('does not show a section with cards or a rich text', () => {
//     const wrapper = factory();

//     wrapper.findAll('[data-qa="browse section"]').length.should.eq(0);
//     wrapper.findAll('[data-qa="markdown"]').length.should.eq(0);
//   });
// });
