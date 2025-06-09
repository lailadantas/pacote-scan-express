
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface UseBarcodeScanner {
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  isScanning: boolean;
  hasPermission: boolean | null;
  error: string | null;
}

export const useBarcodeScanner = (
  onDetected: (code: string) => void
): UseBarcodeScanner => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<any>(null);

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
      setHasPermission(true);
      setIsScanning(true);

      if (codeReader.current) {
        const videoElement = document.getElementById('barcode-scanner') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          
          const controls = await codeReader.current.decodeFromVideoDevice(undefined, videoElement, (result, error) => {
            if (result) {
              const code = result.getText();
              onDetected(code);
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
      setHasPermission(false);
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
    setIsScanning(false);
  };

  return {
    startScanning,
    stopScanning,
    isScanning,
    hasPermission,
    error
  };
};
