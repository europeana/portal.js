import { ItemMediaPresentationTextTrack } from './itemMediaTextTracks.js';

describe('ItemMediaPresentationTextTrack', () => {
  it('parses subtitling annotation body', () => {
    const anno = {
      body: {
        language: 'en',
        value: '1\n00:00:21,840 --> 00:00:24,910\nFirstly, this.\n\n2\n00:00:24,990 --> 00:00:28,500\nSecondly, that.\n'
      },
      motivation: 'subtitling'
    };

    const track = new ItemMediaPresentationTextTrack(anno);

    expect(track.kind).toBe('subtitles');
    expect(track.language).toBe('en');
    expect(track.cues[0].startTime).toBe(21.84);
    expect(track.cues[0].endTime).toBe(24.91);
    expect(track.cues[0].text).toBe('Firstly, this.');
    expect(track.cues[1].startTime).toBe(24.99);
    expect(track.cues[1].endTime).toBe(28.5);
    expect(track.cues[1].text).toBe('Secondly, that.');
  });

  describe('when motivation is captioning', () => {
    it('sets kind to captions', () => {
      const anno = {
        body: {
          language: 'en',
          value: '1\n00:00:21,840 --> 00:00:24,910\nFirstly, this.\n\n2\n00:00:24,990 --> 00:00:28,500\nSecondly, that.\n'
        },
        motivation: 'captioning'
      };

      const track = new ItemMediaPresentationTextTrack(anno);

      expect(track.kind).toBe('captions');
    });
  });
});
