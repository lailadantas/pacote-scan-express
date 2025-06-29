
import { useEffect } from 'react';
import { useQuaggaScanner } from '@/hooks/useQuaggaScanner';

interface BarcodeScannerProps {
  onCodeDetected: (code: string) => void;
  isActive: boolean;
}

const BarcodeScanner = ({ onCodeDetected, isActive }: BarcodeScannerProps) => {
  const { startScanning, stopScanning, isScanning, error } = useQuaggaScanner(onCodeDetected);

  useEffect(() => {
    if (isActive && !isScanning) {
      startScanning().catch(console.error);
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
          <button 
            onClick={() => startScanning().catch(console.error)}
            className="mt-2 px-4 py-2 bg-white/20 text-white rounded text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl h-64 overflow-hidden">
      <div
        id="barcode-scanner"
        className="w-full h-full"
      />
      
      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
      
      {/* Scanning line */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-0.5 bg-red-500 animate-pulse"></div>
      </div>

      {/* Status indicator */}
      {isScanning && (
        <div className="absolute top-2 right-2 bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default BarcodeScanner;
