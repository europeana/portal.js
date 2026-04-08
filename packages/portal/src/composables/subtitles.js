import { readonly, ref, watchEffect } from 'vue';

export class ItemMediaPresentationSubtitleTrack {
  kind = 'subtitles';
  label;
  language;
  cues = [];

  constructor(annoMotivation, annoBody) {
    this.label = annoBody.language?.toUpperCase();
    this.language = annoBody.language;
    this.cues = this.constructor.parseAnnoBodyValue(annoBody.value);

    if (annoMotivation === 'captioning') {
      this.kind = 'captions';
    }
  }

  static parseAnnoBodyValue(annoBodyValue) {
    return annoBodyValue
      .trim()
      .split(/[\r\n]{2,}/)
      .map((seq) => ItemMediaPresentationSubtitleCue.parseSRTSequence(seq));
  }
}

export class ItemMediaPresentationSubtitleCue {
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

    return new ItemMediaPresentationSubtitleCue(startTime, endTime, text);
  }

  static parseSRTTimeToSeconds(time) {
    const splitMilliseconds = time.split(',');
    const milliseconds = new Number(splitMilliseconds[1]);
    const splitHoursMinutesSeconds = splitMilliseconds[0].split(':');
    const seconds = new Number(splitHoursMinutesSeconds[2]);
    const minutes = new Number(splitHoursMinutesSeconds[1]);
    const hours = new Number(splitHoursMinutesSeconds[0]);
    return (hours * 60 * 60) + (minutes * 60) + seconds + (milliseconds / 1000);
  }
}

export function useSubtitles(annotations, resource) {
  const subtitles = ref([]);

  watchEffect(() => {
    subtitles.value = annotations?.value
      ?.filter((anno) => anno.target?.source === resource?.value?.id)
      .map((anno) => new ItemMediaPresentationSubtitleTrack(anno.motivation, anno.body));
  });

  return {
    subtitles: readonly(subtitles)
  };
}
