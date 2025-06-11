
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const ResultadoBipagemReceber = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/receber', { 
        state: { pacotes },
        replace: true 
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, pacotes]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-green-100">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
        <div className="mb-6 flex justify-center">
          <Check className="w-16 h-16 text-green-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Recebimento confirmado!
        </h2>
        
        <p className="text-gray-600">
          {pacotes.length} pacotes adicionados ao estoque
        </p>
      </div>
    </div>
  );
};

export default ResultadoBipagemReceber;
