
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tipoUsuario: '',
    endereco: ''
  });

  useEffect(() => {
    // Recupera dados do usuário do localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        tipoUsuario: userData.tipoUsuario || 'Entregador',
        endereco: userData.endereco || ''
      });
    }
  }, []);

  const handleSave = () => {
    // Salva os dados editados
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <MobileLayout title="Meu perfil" showBackButton>
      <div className="p-4 space-y-6">
        {/* Header do perfil */}
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{formData.name}</h2>
          <p className="text-purple-600 font-medium">{formData.tipoUsuario}</p>
        </div>

        {/* Informações do perfil */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Informações pessoais</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <div className="flex items-center mt-1">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <span className="text-gray-700">{formData.name}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="flex items-center mt-1">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <span className="text-gray-700">{formData.email}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <div className="flex items-center mt-1">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <span className="text-gray-700">{formData.phone}</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <div className="flex items-center mt-1">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                {isEditing ? (
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                  />
                ) : (
                  <span className="text-gray-700">{formData.endereco || 'Não informado'}</span>
                )}
              </div>
            </div>

            <div>
              <Label>Tipo de usuário</Label>
              <div className="flex items-center mt-1">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{formData.tipoUsuario}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6">
              <Button onClick={handleSave} className="w-full">
                Salvar alterações
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Perfil;
