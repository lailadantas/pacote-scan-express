
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface UseBarcodeScanner {
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  isScanning: boolean;
  error: string | null;
}

export const useBarcodeScanner = (
  onDetected: (code: string) => void
): UseBarcodeScanner => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<any>(null);
  const cooldownRef = useRef<boolean>(false);

  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async (): Promise<void> => {
    try {
      setError(null);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      setIsScanning(true);

      if (codeReader.current) {
        const videoElement = document.getElementById('barcode-scanner') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          
          const controls = await codeReader.current.decodeFromVideoDevice(undefined, videoElement, (result, error) => {
            if (result && !cooldownRef.current) {
              const code = result.getText();
              cooldownRef.current = true;
              onDetected(code);
              
              // Ativa o cooldown por 3 segundos
              setTimeout(() => {
                cooldownRef.current = false;
              }, 3000);
            }
            if (error && !(error.name === 'NotFoundException')) {
              console.error('Scanner error:', error);
            }
          });
          
          controlsRef.current = controls;
        }
      }
    } catch (err: any) {
      console.error('Failed to start scanner:', err);
      setError(err.message || 'Failed to access camera');
      setIsScanning(false);
    }
  };

  const stopScanning = (): void => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    cooldownRef.current = false;
    setIsScanning(false);
  };

  return {
    startScanning,
    stopScanning,
    isScanning,
    error
  };
};
