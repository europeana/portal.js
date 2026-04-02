import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import MediaAudioVisualPlayer from '@/components/media/MediaAudioVisualPlayer.vue';
import nock from 'nock';
import { ItemMediaPresentationSubtitleTrack } from '@/composables/subtitles.js';

const localVue = createLocalVue();
const factory = ({ propsData } = {}) => mountNuxt(MediaAudioVisualPlayer, {
  localVue,
  propsData: {
    format: 'video/mpeg',
    itemId: '/123/abcdef',
    poster: 'null',
    subTitles: [],
    url: 'https://www.example.org/video.mpeg',
    ...propsData
  },
  mocks: {
    $t: (key) => key,
    $i18n: {
      locale: 'en'
    }
  }
});

describe('components/media/MediaAudioVisualPlayer', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterEach(nock.cleanAll);

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('computed', () => {
    describe('for a file with audio type', () => {
      it('renders an audio component', async() => {
        const wrapper = factory({ propsData: { format: 'audio/mp3' } });

        await wrapper.vm.fetch();
        expect(wrapper.vm.mediaComponent).toBe('audio');
      });
    });
    describe('for a file with video type', () => {
      it('renders a video component', async() => {
        const wrapper = factory();
        await wrapper.vm.fetch();
        expect(wrapper.vm.mediaComponent).toBe('video');
      });
    });
  });

  describe('fetch', () => {
    describe('for a euScreen Url', () => {
      const url = 'https://www.euscreen.eu/item.html?id=EUS_1234';
      beforeEach(() => {
        nock('https://euscreen.embd.eu')
          .get('/EUS_1234')
          .reply(200, {
            location: 'mediaURL EUScreen',
            format: 'mediaFormat EUScreen'
          });
      });

      it('uses the mediaUrl and format from the EUscreen response', async() => {
        const wrapper = await factory({ propsData: { url } });

        await wrapper.vm.fetch();

        expect(nock.isDone()).toBe(true);
        expect(wrapper.vm.mediaUrl).toBe('mediaURL EUScreen');
        expect(wrapper.vm.mediaFormat).toBe('mediaFormat EUScreen');
      });
    });

    describe('for a NON euScreen Url', () => {
      it('uses the mediaUrl and format from the props data', async() => {
        const wrapper = factory();

        await wrapper.vm.fetch();

        expect(wrapper.vm.mediaUrl).toBe('https://www.example.org/video.mpeg');
        expect(wrapper.vm.mediaFormat).toBe('video/mpeg');
      });
    });
  });

  describe('methods', () => {
    describe('initVideojs', () => {
      it('sets player variable to a videojs player', async() => {
        const wrapper = factory();

        // Setup component so things can be initialised
        await wrapper.vm.fetch();

        await wrapper.vm.initVideojs();
        // Wait for next tick when player is set.
        await wrapper.vm.$nextTick();

        // just checks, that an object was asigned. Should this be more specific?
        expect(typeof wrapper.vm.player).toBe('object');
      });
    });
    describe('initTextTracks', () => {
      describe('when there are no subtitles to display', () => {
        it('does NOT set any text tracks', async() => {
          const wrapper = factory();

          // init player first, so the tracks can be added to something
          await wrapper.vm.fetch();
          await wrapper.vm.initVideojs();
          await wrapper.vm.$nextTick();

          const addTextTrackStub = sinon.stub(wrapper.vm.player, 'addTextTrack').returns({ cues: [] });

          await wrapper.vm.initTextTracks();

          expect(addTextTrackStub.notCalled).toBe(true);
        });
      });
      describe('when there are subtitles to display', () => {
        const subtitles = [
          new ItemMediaPresentationSubtitleTrack({
            language: 'en',
            value: '1\n00:00:01,000 --> 00:00:02,000 subtitle \n'
          }),
          new ItemMediaPresentationSubtitleTrack({
            language: 'nl',
            value: '1\n00:00:01,000 --> 00:00:02,000 ondertitel \n'
          })
        ];

        it('adds a text track for each subtitle', async() => {
          const wrapper = factory({ propsData: { subtitles } });

          // init player first, so the tracks can be added to something
          await wrapper.vm.fetch();
          await wrapper.vm.initVideojs();
          await wrapper.vm.$nextTick();

          const addTextTrackStub = sinon.stub(wrapper.vm.player, 'addTextTrack').returns({ cues: [] });

          await wrapper.vm.initTextTracks();

          expect(addTextTrackStub.calledTwice).toBe(true);
        });
      });
    });
  });
});
