export const NOTES = [
  'C',  'Db', 'D',  'Eb',
  'E',  'F',  'Gb', 'G',
  'Ab', 'A',  'Bb', 'B'
];

export const SCALE_TYPES = [
  {
    name: 'Major',
    steps: [2, 2, 1, 2, 2, 2, 1]
  },
  {
    name: 'Minor',
    steps: [2, 1, 2, 2, 1, 2, 2]
  },
  {
    name: 'Major (pentatonic)',
    steps: [2, 2, 3, 2, 3]
  },
  {
    name: 'Minor (pentatonic)',
    steps: [3, 2, 2, 3, 2]
  },
];

const getNoteFrequency = (note, octave) => {
  return 440 * Math.pow(2, (NOTES.indexOf(note) + (octave - 4) * 12) / 12);
};

export const getScaleFreqs = (
  baseNote, 
  scaleName,
  minOctave=-8,
  maxOctave=8,
) => {
  let scaleSteps;
  for (const scaleType of SCALE_TYPES) {
    if (scaleType.name === scaleName) {
      scaleSteps = scaleType.steps;
    }
  }
  const scaleNotes = [];
  let index = NOTES.indexOf(baseNote);
  for (const step of scaleSteps) {
    scaleNotes.push(NOTES[index])
    index += step;
  }
  const scaleFreqs = [];
  for (let i = minOctave; i <= maxOctave; i++) {
    for (const note of scaleNotes) {
      scaleFreqs.push(getNoteFrequency(note, i));
    }
  }
  return new Float32Array(scaleFreqs);
};