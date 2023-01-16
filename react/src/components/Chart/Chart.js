import tinygradient from 'tinygradient';
import { useEffect, useRef, useState } from 'react';
import styles from './Chart.css';

const LINE_WIDTH = 5;
const MIN_CONFIDENCE_SQUARED = 0.5;

export const Chart = ({ freqs, confidences, color }) => {
  
  const ref = useRef(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  const updateDims = () => {
    if (ref) {
      const { clientWidth, clientHeight } = ref.current;
      if (dims.width !== clientWidth || dims.height !== clientHeight) {
        setDims({ width: clientWidth, height: clientHeight });
      }
      draw(freqs, confidences, color, ref.current.getContext('2d'));
    }
  };

  useEffect(() => {
    window.addEventListener('resize', () => setDims({ width: 0, height: 0 }));
  }, []);

  useEffect(() => {
    updateDims();
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

const draw = (freqs, confidences, color, context) => {
  const { width, height } = context.canvas;
  const normalizedConfidences = normalize(confidences);
  const coords = freqsToCoords(freqs, normalizedConfidences, width, height);
  const colors = confidencesToColors(normalizedConfidences, color);
  context.clearRect(0, 0, width, height);
  context.moveTo(0, height);
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

const normalize = (values) => {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < values.length; i++) {
    min = Math.min(min, values[i]);
    max = Math.max(max, values[i]);
  }
  return Array.from(values).map((value) => {
    return (value - min) / (max - min);
  });
};

const freqsToCoords = (freqs, confidences, width, height) => {
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < freqs.length; i++) {
    const confidenceSquared = confidences[i] * confidences[i];
    if (confidenceSquared > MIN_CONFIDENCE_SQUARED) {
      yMin = Math.min(yMin, freqs[i]);
      yMax = Math.max(yMax, freqs[i]);
    }
  }
  return Array.from(freqs).map((freq, index) => {
    const x = index / (freqs.length - 1) * width;
    let y = (1 - (freq - yMin) / (yMax - yMin)) * height;
    y = Math.max(y, 0);
    y = Math.min(y, height);
    return { x, y };
  });
};

const confidencesToColors = (confidences, color) => {
  const gradient = tinygradient(['#FFFFFF', color]).rgb(100);
  const hexGradient = gradient.map((color) => color.toHexString());
  return Array.from(confidences).map((value) => {
    const valueSquared = value * value;
    if (valueSquared < MIN_CONFIDENCE_SQUARED) {
      return hexGradient[0];
    }
    const colorIndex = Math.floor(valueSquared * (gradient.length - 1));
    return hexGradient[colorIndex];
  });
};
