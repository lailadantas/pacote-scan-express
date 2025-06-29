
import { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

interface UseQuaggaScanner {
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  isScanning: boolean;
  error: string | null;
}

export const useQuaggaScanner = (
  onDetected: (code: string) => void
): UseQuaggaScanner => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cooldownRef = useRef<boolean>(false);
  const isInitialized = useRef<boolean>(false);

  const startScanning = async (): Promise<void> => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      const config = {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector('#barcode-scanner') as HTMLElement,
          constraints: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 }
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        },
        locate: true
      } as const;

      return new Promise((resolve, reject) => {
        Quagga.init(config, (err: any) => {
          if (err) {
            console.error('QuaggaJS initialization error:', err);
            setError('Failed to initialize camera');
            reject(err);
            return;
          }

          Quagga.start();
          setIsScanning(true);
          isInitialized.current = true;

          // Listener para detecção de códigos
          Quagga.onDetected((result) => {
            if (!cooldownRef.current && result.codeResult) {
              const code = result.codeResult.code;
              if (code && code.length > 0) {
                cooldownRef.current = true;
                onDetected(code);
                
                // Cooldown de 2 segundos
                setTimeout(() => {
                  cooldownRef.current = false;
                }, 2000);
              }
            }
          });

          resolve();
        });
      });
    } catch (err: any) {
      console.error('Failed to start scanner:', err);
      setError(err.message || 'Failed to access camera');
      setIsScanning(false);
      throw err;
    }
  };

  const stopScanning = (): void => {
    if (isInitialized.current) {
      Quagga.stop();
      isInitialized.current = false;
    }
    cooldownRef.current = false;
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return {
    startScanning,
    stopScanning,
    isScanning,
    error
  };
};
