
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Servicos = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/meusservicos');
  }, [navigate]);

  return null;
};

export default Servicos;
