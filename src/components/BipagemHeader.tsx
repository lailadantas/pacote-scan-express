
import BarcodeScanner from '@/components/BarcodeScanner';
import { ScanLine } from 'lucide-react';

interface BipagemHeaderProps {
  onCodeDetected: (code: string) => void;
  isScannerActive: boolean;
}

const BipagemHeader = ({ onCodeDetected, isScannerActive }: BipagemHeaderProps) => {
  return (
    <div className="flex-1 p-4">
      {/* Scanner Area */}
      <BarcodeScanner 
        onCodeDetected={onCodeDetected}
        isActive={isScannerActive}
      />

      {/* Status Message */}
      <div className="bg-white rounded-xl p-4 my-6 shadow-sm">
        <div className="flex items-center justify-center">
          <ScanLine className="w-6 h-6 mr-3 text-gray-600" />
          <span className="text-center font-medium text-gray-600">
            Posicione o código de barras dentro da área tracejada
          </span>
        </div>
      </div>
    </div>
  );
};

export default BipagemHeader;
