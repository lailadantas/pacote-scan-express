
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ColetaSucesso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/rotaemandamento/1');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <CheckCircle className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">
          Coleta realizada com sucesso!
        </h1>
        <p className="text-green-100">
          Redirecionando...
        </p>
      </div>
    </div>
  );
};

export default ColetaSucesso;
