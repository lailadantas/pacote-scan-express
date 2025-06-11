import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Check, AlertTriangle, X } from 'lucide-react';

const ResultadoBipagem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { resultado, codigo, pacotes = [] } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      // Se veio de um contexto específico, redireciona com o contexto
      const contexto = searchParams.get('contexto');
      const pontoId = searchParams.get('pontoId');
      
      let targetPath = '/bipagem';
      if (contexto) {
        targetPath += `?contexto=${contexto}`;
        if (pontoId) {
          targetPath += `&pontoId=${pontoId}`;
        }
      }
      
      navigate(targetPath, { 
        state: { pacotes },
        replace: true 
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, pacotes, searchParams]);

  const getIcon = () => {
    switch (resultado) {
      case 'sucesso':
        return <Check className="w-16 h-16 text-green-500" />;
      case 'pendencia':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'erro':
        return <X className="w-16 h-16 text-red-500" />;
      default:
        return <Check className="w-16 h-16 text-green-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (resultado) {
      case 'sucesso':
        return 'bg-green-100';
      case 'pendencia':
        return 'bg-yellow-100';
      case 'erro':
        return 'bg-red-100';
      default:
        return 'bg-green-100';
    }
  };

  const getMessage = () => {
    switch (resultado) {
      case 'sucesso':
        return {
          title: 'Item bipado com sucesso!',
          description: `Código: ${codigo}`
        };
      case 'pendencia':
        return {
          title: 'Item com pendência',
          description: 'Verifique o código e tente novamente'
        };
      case 'erro':
        return {
          title: 'Erro na bipagem',
          description: 'Código já existe na listagem'
        };
      default:
        return {
          title: 'Item bipado com sucesso!',
          description: `Código: ${codigo}`
        };
    }
  };

  const message = getMessage();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${getBackgroundColor()}`}>
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
        <div className="mb-6 flex justify-center">
          {getIcon()}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {message.title}
        </h2>
        
        <p className="text-gray-600">
          {message.description}
        </p>
      </div>
    </div>
  );
};

export default ResultadoBipagem;
