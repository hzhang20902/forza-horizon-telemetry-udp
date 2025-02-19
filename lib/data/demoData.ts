import { TelemetryData } from '@/lib/data/websocket';
import { useState, useEffect } from 'react'

export const generateDemoData = (): TelemetryData => ({
  speed: Math.random() * 150,
  rpm: Math.random() * 7000,
  gear: Math.floor(Math.random() * 6) + 1,
  steeringAngle: (Math.random() - 0.5) * 180,
  throttle: Math.random(),
  brake: Math.random(),
  fuel: Math.random(),
});

export const useDemoData = (interval: number = 1000): TelemetryData => {
  const [data, setData] = useState<TelemetryData>(generateDemoData());

  useEffect(() => {
    const timer = setInterval(() => {
      setData(generateDemoData());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return data;
};

