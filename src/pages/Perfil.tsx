
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Edit, CreditCard, Clock, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tipoUsuario: '',
    endereco: '',
    // Dados adicionais do cadastro
    tipoPessoa: '',
    cpf: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    horaLimiteColeta: '',
    banco: '',
    agencia: '',
    conta: '',
    chavePix: ''
  });

  useEffect(() => {
    // Recupera dados do usuário do localStorage
    const currentUser = localStorage.getItem('currentUser');
    const userData = localStorage.getItem('userData');
    
    if (currentUser && userData) {
      const user = JSON.parse(currentUser);
      const fullData = JSON.parse(userData);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || fullData.celular || '',
        tipoUsuario: user.tipoUsuario || 'Entregador',
        endereco: user.endereco || '',
        tipoPessoa: fullData.tipoPessoa || '',
        cpf: fullData.cpf || '',
        cnpj: fullData.cnpj || '',
        razaoSocial: fullData.razaoSocial || '',
        nomeFantasia: fullData.nomeFantasia || '',
        horaLimiteColeta: fullData.horaLimiteColeta || '',
        banco: fullData.banco || '',
        agencia: fullData.agencia || '',
        conta: fullData.conta || '',
        chavePix: fullData.chavePix || ''
      });
    } else if (currentUser) {
      const userData = JSON.parse(currentUser);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        tipoUsuario: userData.tipoUsuario || 'Entregador',
        endereco: userData.endereco || '',
        tipoPessoa: '',
        cpf: '',
        cnpj: '',
        razaoSocial: '',
        nomeFantasia: '',
        horaLimiteColeta: '',
        banco: '',
        agencia: '',
        conta: '',
        chavePix: ''
      });
    }
  }, []);

  const handleSave = () => {
    // Salva os dados editados
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { 
      ...currentUser, 
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      endereco: formData.endereco
    };
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

        {/* Informações pessoais */}
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
          </div>

          {isEditing && (
            <div className="mt-6">
              <Button onClick={handleSave} className="w-full">
                Salvar alterações
              </Button>
            </div>
          )}
        </div>

        {/* Dados adicionais */}
        {(formData.cpf || formData.cnpj || formData.horaLimiteColeta) && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do cadastro</h3>
            <div className="space-y-4">
              {formData.tipoPessoa === 'fisica' && formData.cpf && (
                <div>
                  <Label>CPF</Label>
                  <div className="flex items-center mt-1">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.cpf}</span>
                  </div>
                </div>
              )}

              {formData.tipoPessoa === 'juridica' && (
                <>
                  {formData.cnpj && (
                    <div>
                      <Label>CNPJ</Label>
                      <div className="flex items-center mt-1">
                        <Building className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{formData.cnpj}</span>
                      </div>
                    </div>
                  )}
                  {formData.razaoSocial && (
                    <div>
                      <Label>Razão Social</Label>
                      <div className="flex items-center mt-1">
                        <Building className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{formData.razaoSocial}</span>
                      </div>
                    </div>
                  )}
                  {formData.nomeFantasia && (
                    <div>
                      <Label>Nome Fantasia</Label>
                      <div className="flex items-center mt-1">
                        <Building className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{formData.nomeFantasia}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {formData.horaLimiteColeta && (
                <div>
                  <Label>Hora limite de coleta</Label>
                  <div className="flex items-center mt-1">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.horaLimiteColeta}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dados bancários */}
        {(formData.banco || formData.chavePix) && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados bancários</h3>
            <div className="space-y-4">
              {formData.banco && (
                <div>
                  <Label>Banco</Label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.banco}</span>
                  </div>
                </div>
              )}

              {formData.agencia && (
                <div>
                  <Label>Agência</Label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.agencia}</span>
                  </div>
                </div>
              )}

              {formData.conta && (
                <div>
                  <Label>Conta</Label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.conta}</span>
                  </div>
                </div>
              )}

              {formData.chavePix && (
                <div>
                  <Label>Chave PIX</Label>
                  <div className="flex items-center mt-1">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{formData.chavePix}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Perfil;
