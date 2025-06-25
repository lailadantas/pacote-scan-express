
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro quando o usuário começa a digitar
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Por favor, insira seu e-mail');
      return false;
    }
    if (!formData.password) {
      setError('Por favor, insira sua senha');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Por favor, insira um e-mail válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.smartenvios.tec.br/core/auth/cms/login/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTYwMzY4NjcsImlhdCI6MTcxNTk1MDQ2Nywic3ViIjp7ImlkIjoiNWE5YTAwYWMtNjQ5NS00OGM1LThkODgtMjFiMDI4ZjU0ODc2In0sImN1c3RvbWVycyI6W119.9ZipvgJ5x_7dov6JMyeg_PK5VcIjJWP2QLDXn6dtf70'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        const userData = {
          person_name: data.result.user.person_name,
          name: data.result.user.person_name || data.result.user.name || 'Usuário',
          email: formData.email,
          token: data.result.token,
          user_id: data.result.user.id,
          person_id: data.result.user.person_id,
          ...data.result.user
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authToken', userData.token);
        
        navigate('/home');
      } else {
        // Trata diferentes tipos de erro
        if (response.status === 401) {
          setError('E-mail ou senha incorretos. Verifique suas credenciais.');
        } else if (response.status === 422) {
          setError('Dados inválidos. Verifique o formato do e-mail e senha.');
        } else if (response.status >= 500) {
          setError('Erro no servidor. Tente novamente em alguns instantes.');
        } else {
          setError(data.message || 'Erro ao fazer login. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF4713] via-[#FF4713] to-orange-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Entrando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF4713] via-[#FF4713] to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/f3d54219-8523-4c16-a475-30845e2fd8bf.png" 
              alt="SmartPontos" 
              className="h-16"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SmartPontos</h1>
          <p className="text-gray-600">Entre na sua conta</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-[#FF4713] hover:text-orange-600"
            >
              Esqueceu a senha?
            </button>
          </div>

          <Button type="submit" className="w-full bg-[#FF4713] hover:bg-orange-600" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Cadastro Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Não possui cadastro?{' '}
          <button
            onClick={() => navigate('/tipodeusuario')}
            className="text-[#FF4713] hover:text-orange-600 font-medium hover:underline"
          >
            Cadastre-se aqui
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
