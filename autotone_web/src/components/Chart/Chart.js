import tinygradient from 'tinygradient';
import { useEffect, useRef, useState } from 'react';
import styles from './Chart.css';

const GRADIENT_START = '#FFFFFF';
const GRADIENT_END = '#4120A8';
const LINE_WIDTH = 5;

export const Chart = ({ freqs, confidences }) => {
  
  const ref = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  const updateDims = ({ clientWidth, clientHeight }) => {
    if (dims.width !== clientWidth || dims.height !== clientHeight) {
      setDims({ width: clientWidth, height: clientHeight });
    }
  };    

  useEffect(() => {
    if (ref) {
      updateDims(ref.current);
      draw(freqs, confidences, ref.current.getContext('2d'));
    }
  }, [ref, freqs, confidences, dims]);

  return (
    <canvas 
      className={styles.canvas} 
      ref={ref} 
      width={dims.width || undefined}
      height={dims.height || undefined}
    />
  );
};

// Helpers =============================================================

const draw = (freqs, confidences, context) => {
  const coords = freqsToCoords(freqs, context.canvas.width, context.canvas.height);
  const colors = confidencesToColors(confidences);
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.moveTo(0, context.canvas.height);
  context.beginPath();
  for (let i = 0; i < coords.length; i++) {
    context.lineTo(coords[i].x, coords[i].y);
    context.strokeStyle = colors[i];
    context.lineWidth = LINE_WIDTH;
    context.stroke();
    context.beginPath();
    context.moveTo(coords[i].x, coords[i].y);
  }
};

const freqsToCoords = (freqs, width, height) => {
  let min = freqs[0];
  let max = freqs[0];
  for (let i = 0; i < freqs.length; i++) {
    min = Math.min(min, freqs[i]);
    max = Math.max(max, freqs[i]);
  }
  return Array.from(freqs).map((freq, index) => {
    const x = index / (freqs.length - 1) * width;
    const y = (1 - (freq - min) / (max - min)) * height;
    return { x, y };
  });
};

const confidencesToColors = (confidences) => {
  const gradient = tinygradient([GRADIENT_START, GRADIENT_END])
    .rgb(100)
    .map((color) => color.toHexString());
  let min = confidences[0];
  let max = confidences[0];
  for (let i = 0; i < confidences.length; i++) {
    min = Math.min(min, confidences[i]);
    max = Math.max(max, confidences[i]);
  }
  return Array.from(confidences).map((confidence) => {
    const value = (confidence - min) / (max - min);
    const colorIndex = Math.floor(value * (gradient.length - 1));
    return gradient[colorIndex];
  });
};
