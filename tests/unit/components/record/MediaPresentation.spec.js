import { shallowMount } from '@vue/test-utils';
import MediaPresentation from '../../../../components/record/MediaPresentation.vue';

const factory = () => shallowMount(MediaPresentation);

describe('components/record/MediaPresentation', () => {
  describe('isPDF', () => {
    context('when mimeType is "application/pdf"', () => {
      it('is `true`', () => {
        const wrapper = factory();
        const props = { mimeType: 'application/pdf' };

        wrapper.setProps(props);

        wrapper.vm.isPDF.should.be.true;
      });
    });

    context('when mimeType is "image/png"', () => {
      it('is `false`', () => {
        const wrapper = factory();
        const props = { mimeType: 'image/png' };

        wrapper.setProps(props);

        wrapper.vm.isPDF.should.be.false;
      });
    });
  });

  describe('isHTMLVideo', () => {
    context('when mimeType is "video/ogg"', () => {
      it('is `true`', () => {
        const wrapper = factory();
        const props = { mimeType: 'video/ogg' };

        wrapper.setProps(props);

        wrapper.vm.isHTMLVideo.should.be.true;
      });
    });

    context('when mimeType is "video/webm"', () => {
      it('is `true`', () => {
        const wrapper = factory();
        const props = { mimeType: 'video/webm' };

        wrapper.setProps(props);

        wrapper.vm.isHTMLVideo.should.be.true;
      });
    });

    context('when mimeType is "video/mp4"', () => {
      context('and codecName is "h264"', () => {
        it('is `true`', () => {
          const wrapper = factory();
          const props = { mimeType: 'video/mp4', codecName: 'h264' };

          wrapper.setProps(props);

          wrapper.vm.isHTMLVideo.should.be.true;
        });
      });

      context('and codecName is "x264"', () => {
        it('is `false`', () => {
          const wrapper = factory();
          const props = { mimeType: 'video/mp4', codecName: 'x264' };

          wrapper.setProps(props);

          wrapper.vm.isHTMLVideo.should.be.false;
        });
      });
    });

    context('when mimeType is "image/png"', () => {
      it('is `false`', () => {
        const wrapper = factory();
        const props = { mimeType: 'image/png' };

        wrapper.setProps(props);

        wrapper.vm.isHTMLVideo.should.be.false;
      });
    });
  });

  describe('displayImage', () => {
    context('when imageSrc is absent', () => {
      it('is `false`', () => {
        const wrapper = factory();
        const props = { mimeType: 'text/plain' };

        wrapper.setProps(props);

        wrapper.vm.displayImage.should.be.false;
      });
    });

    context('when imageSrc is present', () => {
      context('and media is HTML video', () => {
        it('is `false`', () => {
          const wrapper = factory();
          const props = { mimeType: 'video/ogg', imageSrc: 'http://www.example.org/preview.jpg' };

          wrapper.setProps(props);

          wrapper.vm.displayImage.should.be.false;
        });
      });

      context('and media is not HTML video', () => {
        it('is `true`', () => {
          const wrapper = factory();
          const props = { mimeType: 'video/quicktime', imageSrc: 'http://www.example.org/preview.jpg' };

          wrapper.setProps(props);

          wrapper.vm.displayImage.should.be.true;
        });
      });
    });
  });
});
