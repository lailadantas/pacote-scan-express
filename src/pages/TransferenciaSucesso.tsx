
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const TransferenciaSucesso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-500 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <CheckCircle className="w-24 h-24 text-white mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">
          Entrega de transferência realizada com sucesso!
        </h1>
        <p className="text-white/90 text-sm">
          Redirecionando para a tela inicial...
        </p>
      </div>
    </div>
  );
};

export default TransferenciaSucesso;
