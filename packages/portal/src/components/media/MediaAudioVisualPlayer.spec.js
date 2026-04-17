import { createLocalVue } from '@vue/test-utils';
import { mountNuxt } from '@test/utils.js';
import sinon from 'sinon';
import MediaAudioVisualPlayer from '@/components/media/MediaAudioVisualPlayer.vue';
import nock from 'nock';
import { ItemMediaPresentationTextTrack } from '@/composables/itemMediaTextTracks.js';

const localVue = createLocalVue();
const factory = ({ propsData } = {}) => mountNuxt(MediaAudioVisualPlayer, {
  attachTo: document.body,
  localVue,
  propsData: {
    format: 'video/mpeg',
    itemId: '/123/abcdef',
    poster: 'null',
    textTracks: [],
    url: 'https://www.example.org/video.mpeg',
    ...propsData
  },
  mocks: {
    $apis: {
      record: {
        mediaProxyUrl: (url, id) => `https://proxy.europeana.eu/media${id}/${url}`
      }
    },
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
    describe('mediaComponent', () => {
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
  });

  describe('fetch', () => {
    describe('for a EUScreen URL', () => {
      const url = 'https://www.euscreen.eu/item.html?id=EUS_1234';
      describe('when EuScreen is available', () => {
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

      describe('when the request for the EuScreen embed fails', () => {
        beforeEach(() => {
          nock('https://euscreen.embd.eu')
            .get('/EUS_1234')
            .replyWithError({ message: 'Service not available' });
        });

        it('emits an error', async() => {
          const wrapper = await factory({ propsData: { url } });
          const emitSpy = sinon.spy(wrapper.vm, '$emit');

          await wrapper.vm.fetch();
          expect(emitSpy.called).toBe(true);
        });
      });
    });

    describe('for a non-EUScreen URL', () => {
      it('uses the URL and format from the props data', async() => {
        const wrapper = factory({ propsData: { itemId: undefined } });

        await wrapper.vm.fetch();

        expect(wrapper.vm.mediaUrl).toBe('https://www.example.org/video.mpeg');
        expect(wrapper.vm.mediaFormat).toBe('video/mpeg');
      });
    });
  });

  describe('methods', () => {
    describe('initVideojs', () => {
      it('sets player variable to a videojs player with the options from data', async() => {
        const wrapper = factory();
        const expectedOptions = wrapper.vm.options;
        // Setup component so things can be initialised
        await wrapper.vm.fetch();

        await wrapper.vm.initVideojs();
        // Wait for next tick when player is set.
        await wrapper.vm.$nextTick();

        // Add checks if other options/overrides are expected to be set.
        expect(wrapper.vm.player.options().controlBar.children).toEqual(expectedOptions.controlBar.children);
      });
    });
    describe('initTextTracks', () => {
      describe('when there are no subtitles to display', () => {
        it('does NOT set any text tracks or cues', async() => {
          const wrapper = factory();

          // init player first, so the tracks can be added to something
          await wrapper.vm.fetch();
          await wrapper.vm.initVideojs();
          await wrapper.vm.$nextTick();

          const addCueStub = sinon.stub();
          const addTextTrackStub = sinon.stub(wrapper.vm.player, 'addTextTrack').returns({ addCue: addCueStub });

          await wrapper.vm.initTextTracks();

          expect(addTextTrackStub.notCalled).toBe(true);
          expect(addCueStub.notCalled).toBe(true);
        });
      });
      describe('when there are subtitles to display', () => {
        const textTracks = [
          new ItemMediaPresentationTextTrack({
            body: {
              language: 'en',
              value: '1\n00:00:01,000 --> 00:00:02,000\n subtitle \n'
            },
            motivation: 'subtitling'
          }),
          new ItemMediaPresentationTextTrack({
            body: {
              language: 'nl',
              value: '1\n00:00:01,000 --> 00:00:02,000\n ondertitel \n'
            },
            motivation: 'captioning'
          })
        ];

        it('adds a text track and cues for each subtitle', async() => {
          const wrapper = factory({ propsData: { textTracks } });

          // init player first, so the tracks can be added to something
          await wrapper.vm.fetch();
          await wrapper.vm.initVideojs();
          await wrapper.vm.$nextTick();

          const addCueStub = sinon.stub();
          const addTextTrackStub = sinon.stub(wrapper.vm.player, 'addTextTrack').returns({ addCue: addCueStub });

          await wrapper.vm.initTextTracks();

          expect(addTextTrackStub.calledTwice).toBe(true);
          expect(addCueStub.calledTwice).toBe(true);
        });
      });
    });
    describe('initTooltips', () => {
      it('adds event listeners to handle hiding and showing tooltips', async() => {
        const wrapper = factory();
        // Setup component so things can be initialised
        await wrapper.vm.fetch();

        await wrapper.vm.initVideojs();
        // Wait for next tick when player is set.
        await wrapper.vm.$nextTick();

        await wrapper.vm.initTooltips();

        const controls = wrapper.vm.getControlsWithTooltips();
        for (const control of controls) {
          control.blur = sinon.spy();

          control.dispatchEvent(new Event('mouseenter'));
          expect(control.classList.contains('show-tooltip')).toBe(true);

          control.dispatchEvent(new Event('mouseleave'));
          expect(control.classList.contains('show-tooltip')).toBe(false);
          expect(control.blur.called).toBe(true);
        }
      });
    });

    describe('onPlayerReady', () => {
      it('initialises text tracks, the poster and tooltips', async() => {
        const wrapper = factory();

        wrapper.vm.initTextTracks = sinon.spy();
        wrapper.vm.initTooltips = sinon.spy();
        wrapper.vm.setPosterWithCardImage = sinon.spy();

        wrapper.vm.onPlayerReady();

        expect(wrapper.vm.initTextTracks.called).toBe(true);
        expect(wrapper.vm.initTooltips.called).toBe(true);
        expect(wrapper.vm.setPosterWithCardImage.called).toBe(true);
      });
    });

    describe('player', () => {
      describe('on error', () => {
        it('emits error event', async() => {
          const message = 'Media playback failed';
          const wrapper = factory();
          await wrapper.vm.fetch();
          await wrapper.vm.initVideojs();
          await wrapper.vm.$nextTick();
          sinon.stub(wrapper.vm.player, 'error').returns({ message });

          wrapper.vm.player.trigger('error');
          expect(wrapper.emitted().error[0][0].message).toBe(message);
        });
      });

      describe('on loadedmetadata', () => {
        describe('when media is seekable', () => {
          const seekable = {
            length: 1,
            start: sinon.stub().returns(0),
            end: sinon.stub().returns(1)
          };

          it('does not disable the control bar progress control', async() => {
            const wrapper = factory();
            await wrapper.vm.fetch();
            await wrapper.vm.initVideojs();
            await wrapper.vm.$nextTick();
            wrapper.vm.$refs.avPlayer = {
              seekable
            };

            wrapper.vm.player.trigger('loadedmetadata');

            expect(wrapper.vm.player.controlBar.progressControl.enabled()).toBe(true);
          });
        });

        describe('when media is not seekable', () => {
          const seekable = {
            length: 1,
            start: sinon.stub().returns(0),
            end: sinon.stub().returns(0)
          };

          it('disables the control bar progress control', async() => {
            const wrapper = factory();
            await wrapper.vm.fetch();
            await wrapper.vm.initVideojs();
            await wrapper.vm.$nextTick();
            wrapper.vm.$refs.avPlayer = {
              seekable
            };

            wrapper.vm.player.trigger('loadedmetadata');

            expect(wrapper.vm.player.controlBar.progressControl.enabled()).toBe(false);
          });

          it('emits warn event', async() => {
            const wrapper = factory();
            await wrapper.vm.fetch();
            await wrapper.vm.initVideojs();
            await wrapper.vm.$nextTick();
            wrapper.vm.$refs.avPlayer = {
              seekable
            };

            wrapper.vm.player.trigger('loadedmetadata');
            expect(wrapper.emitted().warn[0][0].name).toBe('MediaAudioVideoPlayerError');
            expect(wrapper.emitted().warn[0][0].message).toBe('A/V not seekable');
          });
        });
      });
    });
  });
});
