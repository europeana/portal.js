import { readonly, ref, watchEffect } from 'vue';

export class ItemMediaPresentationTextTrack {
  kind = 'subtitles';
  language;
  cues = [];

  constructor(anno) {
    this.language = anno.body.language;
    this.cues = this.constructor.parseAnnoBodyValue(anno.body.value);

    if (anno.motivation === 'captioning') {
      this.kind = 'captions';
    }
  }

  static parseAnnoBodyValue(annoBodyValue) {
    return annoBodyValue
      .trim()
      .split(/[\r\n]{2,}/)
      .map((seq) => ItemMediaPresentationTextCue.parseSRTSequence(seq));
  }
}

export class ItemMediaPresentationTextCue {
  startTime;
  endTime;
  text;

  constructor(startTime, endTime, text) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.text = text;
  }

  static parseSRTSequence(sequence) {
    const parts = sequence.trim().split(/[\r\n]/);
    const timespan = parts[1].split(' --> ');

    const startTime = this.parseSRTTimeToSeconds(timespan[0]);
    const endTime = this.parseSRTTimeToSeconds(timespan[1]);
    const text = parts[2];

    return new ItemMediaPresentationTextCue(startTime, endTime, text);
  }

  static parseSRTTimeToSeconds(time) {
    const splitMilliseconds = time.split(',');
    const milliseconds = Number(splitMilliseconds[1]);
    const splitHoursMinutesSeconds = splitMilliseconds[0].split(':');
    const seconds = Number(splitHoursMinutesSeconds[2]);
    const minutes = Number(splitHoursMinutesSeconds[1]);
    const hours = Number(splitHoursMinutesSeconds[0]);
    return (hours * 60 * 60) + (minutes * 60) + seconds + (milliseconds / 1000);
  }
}

export function useItemMediaTextTracks(annotations, resource) {
  const textTracks = ref([]);

  watchEffect(() => {
    textTracks.value = annotations?.value
      ?.filter((anno) => anno.target?.source === resource?.value?.id)
      .map((anno) => new ItemMediaPresentationTextTrack(anno));
  });

  return {
    textTracks: readonly(textTracks)
  };
}
