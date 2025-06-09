
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Package, Truck, MapPin, Building, Warehouse } from 'lucide-react';

const TipoDeUsuario = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const userTypes = [
    { value: 'embarcador', label: 'Embarcador', icon: Package },
    { value: 'motorista', label: 'Motorista', icon: Truck },
    { value: 'ponto-coleta', label: 'Ponto de coleta', icon: MapPin },
    { value: 'franquia', label: 'Franquia', icon: Building },
    { value: 'hub', label: 'HUB', icon: Warehouse }
  ];

  const handleContinue = () => {
    if (!selectedType) return;

    // Salva o tipo de usuário selecionado
    localStorage.setItem('userType', selectedType);

    // Redireciona baseado no tipo selecionado
    if (['ponto-coleta', 'franquia', 'hub'].includes(selectedType)) {
      navigate('/usuariotipoponto');
    } else {
      // Para Embarcador e Motorista, pode ir direto para home ou outro fluxo
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Quem é você?</h1>
        </div>

        {/* User Type Selection */}
        <RadioGroup value={selectedType} onValueChange={setSelectedType} className="space-y-4">
          {userTypes.map(({ value, label, icon: Icon }) => (
            <div key={value} className="flex items-center space-x-3">
              <RadioGroupItem value={value} id={value} />
              <Label
                htmlFor={value}
                className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-gray-50"
              >
                <Icon className="w-5 h-5 text-purple-600" />
                <span className="font-medium">{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700"
        >
          Continuar
        </Button>
      </motion.div>
    </div>
  );
};

export default TipoDeUsuario;
