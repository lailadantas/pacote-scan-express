
import { useEffect } from 'react';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';

interface BarcodeScannerProps {
  onCodeDetected: (code: string) => void;
  isActive: boolean;
}

const BarcodeScanner = ({ onCodeDetected, isActive }: BarcodeScannerProps) => {
  const { startScanning, stopScanning, isScanning, error } = useBarcodeScanner(onCodeDetected);

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanning();
    } else if (!isActive && isScanning) {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive]);

  if (error) {
    return (
      <div className="relative bg-black rounded-xl h-64 flex items-center justify-center overflow-hidden">
        <div className="text-center text-white p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl h-64 overflow-hidden">
      <video
        id="barcode-scanner"
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      
      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
      
      {/* Scanning line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-0.5 bg-red-500 animate-pulse"></div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
