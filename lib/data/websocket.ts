import { useState, useEffect, useCallback } from 'react';

export interface TelemetryData {
    speed: { mph: number; kph: number }
    rpm: number
    gear: number
    steeringAngle: number
    throttle: number
    brake: number
    clutch: number
    fuel: { amount: number; capacity: number }
    position: { x: number; y: number; z: number }
    acceleration: { x: number; y: number; z: number }
    velocity: { x: number; y: number; z: number }
    angularVelocity: { x: number; y: number; z: number }
    tireTemperature: { fl: number; fr: number; rl: number; rr: number }
    tirePressure: { fl: number; fr: number; rl: number; rr: number }
    suspensionTravel: { fl: number; fr: number; rl: number; rr: number }
    engineTemperature: number
    oilTemperature: number
    oilPressure: number
    boost: number
    power: number
    torque: number
    lapTime: { current: number; last: number; best: number }
    racePosition: number
    lapNumber: number
    distanceTraveled: number
  }  

interface WebSocketState {
  isConnected: boolean;
  error: Error | null;
}

const WEBSOCKET_URL = 'ws://localhost:8080';
const RECONNECT_INTERVAL = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

export function useTelemetryData(): [TelemetryData | null, WebSocketState] {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [wsState, setWsState] = useState<WebSocketState>({ isConnected: false, error: null });

  const connect = useCallback(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;

    const attemptConnect = () => {
      ws = new WebSocket(WEBSOCKET_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsState({ isConnected: true, error: null });
        reconnectAttempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const telemetryData = JSON.parse(event.data);
          setData(telemetryData);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setWsState((prev) => ({ ...prev, error: new Error('WebSocket connection error') }));
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        setWsState((prev) => ({ ...prev, isConnected: false }));
        setData(null);

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          setTimeout(attemptConnect, RECONNECT_INTERVAL);
        } else {
          setWsState((prev) => ({ ...prev, error: new Error('Max reconnection attempts reached') }));
        }
      };
    };

    attemptConnect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return [data, wsState];
}

