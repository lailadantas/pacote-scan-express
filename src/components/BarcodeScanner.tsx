
import { useEffect } from 'react';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { Camera, CameraOff } from 'lucide-react';

interface BarcodeScannerProps {
  onCodeDetected: (code: string) => void;
  isActive: boolean;
}

const BarcodeScanner = ({ onCodeDetected, isActive }: BarcodeScannerProps) => {
  const { startScanning, stopScanning, isScanning, hasPermission, error } = useBarcodeScanner(onCodeDetected);

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

  const handleRequestPermission = () => {
    startScanning();
  };

  if (hasPermission === null || hasPermission === false) {
    return (
      <div className="relative bg-black rounded-xl h-64 flex items-center justify-center overflow-hidden">
        <div className="text-center text-white p-4">
          {hasPermission === false ? (
            <>
              <CameraOff className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="mb-4">Acesso à câmera negado</p>
              <button
                onClick={handleRequestPermission}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Tentar novamente
              </button>
            </>
          ) : (
            <>
              <Camera className="w-12 h-12 mx-auto mb-4" />
              <p className="mb-4">Permissão necessária para acessar a câmera</p>
              <button
                onClick={handleRequestPermission}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
              >
                Permitir acesso à câmera
              </button>
            </>
          )}
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
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
