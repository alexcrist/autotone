let audioContext;

export const init = async () => {
  audioContext = new AudioContext();
  audioContext.suspend();
};

export const play = async (data, sampleRate) => {
  const buffer = audioContext.createBuffer(1, data.length, sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    channel[i] = data[i];
  }
  const audioSource = audioContext.createBufferSource();
  audioSource.connect(audioContext.destination);
  audioSource.buffer = buffer;
  audioContext.resume();
  audioSource.start();
};

export const pause = () => {
  audioContext.suspend();
};