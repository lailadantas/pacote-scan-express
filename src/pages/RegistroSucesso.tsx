
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const RegistroSucesso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determinar se é coleta baseado na URL anterior
  const isColeta = location.state?.isColeta || window.history.state?.usr?.from?.includes('coletar');

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
          Registro feito com sucesso!
        </h1>
        <p className="text-green-100">
          Redirecionando...
        </p>
      </div>
    </div>
  );
};

export default RegistroSucesso;
