import { createLocalVue, shallowMount } from '@vue/test-utils';
import ExhibitionChapterLinkList from './ExhibitionChapterLinkList.vue';

const localVue = createLocalVue();

const factory = ({ propsData = {} } = {}) => shallowMount(ExhibitionChapterLinkList, {
  localVue,
  propsData,
  mocks: {
    $t: (key) => key
  },
  stubs: {
    LinkList: {
      props: {
        items: {
          type: Array,
          default: () => []
        },
        title: {
          type: String,
          default: null
        }
      },
      template: `
        <div id="link-list">
          <h2>{{ title }}</h2>
          <span
            v-for="(item, index) in items"
            :key="index"
            :id="item.identifier"
          >
            {{ item.text }}
          </span>
        </div>
      `
    }
  }
});

describe('@/components/exhibition/ExhibitionChapterLinkList', () => {
  const chapters = [
    { identifier: 'chapter-1', name: 'Chapter 1' },
    { identifier: 'chapter-2', name: 'Chapter 2' }
  ];
  const exhibitionIdentifier = 'exhibition';

  it('renders a LinkList for the exhibition chapters', () => {
    const wrapper = factory({ propsData: { chapters, exhibitionIdentifier } });

    const linkList = wrapper.find('#link-list');
    const heading = linkList.find('h2');
    expect(heading.text()).toBe('exhibitions.chapters');

    for (const chapter of chapters) {
      const chapterElement = linkList.find(`#${chapter.identifier}`);
      expect(chapterElement.isVisible()).toBe(true);
      expect(chapterElement.text()).toBe(chapter.name);
    }
  });

  describe('when credits prop is `true`', () => {
    const credits = true;

    it('also renders a link for the credits', () => {
      const wrapper = factory({ propsData: { chapters, credits, exhibitionIdentifier } });

      const linkList = wrapper.find('#link-list');

      const creditsElement = linkList.find('#credits');
      expect(creditsElement.isVisible()).toBe(true);
      expect(creditsElement.text()).toBe('exhibitions.credits');
    });
  });
});
