
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Mail, Phone, Eye, EyeOff, Building, CreditCard } from 'lucide-react';

const UsuarioTipoPonto = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Tela 1
    nome: '',
    email: '',
    celular: '',
    aceitaTermos: false,
    aceitaPrivacidade: false,
    // Tela 2
    codigo: '',
    // Tela 3
    senha: '',
    confirmarSenha: '',
    // Tela 4
    tipoPessoa: '',
    cnpj: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    razaoSocial: '',
    nomeFantasia: '',
    cpf: '',
    horaLimiteColeta: '',
    // Tela 5
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    complemento: '',
    // Tela 6
    banco: '',
    agencia: '',
    conta: '',
    titularidade: '',
    tipoConta: '',
    chavePix: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Salva os dados e vai para tela de sucesso
      localStorage.setItem('userData', JSON.stringify(formData));
      localStorage.setItem('currentUser', JSON.stringify({ name: formData.nome, email: formData.email }));
      navigate('/cadastrosucesso');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.nome && formData.email && formData.celular && formData.aceitaTermos && formData.aceitaPrivacidade;
      case 2:
        return formData.codigo.length === 6;
      case 3:
        return formData.senha && formData.confirmarSenha && formData.senha === formData.confirmarSenha;
      case 4:
        if (formData.tipoPessoa === 'juridica') {
          return formData.cnpj && formData.razaoSocial && formData.nomeFantasia && formData.horaLimiteColeta;
        } else if (formData.tipoPessoa === 'fisica') {
          return formData.cpf && formData.horaLimiteColeta;
        }
        return false;
      case 5:
        return formData.cep && formData.estado && formData.cidade && formData.bairro && formData.logradouro && formData.numero;
      case 6:
        return formData.banco && formData.agencia && formData.conta && formData.titularidade && formData.tipoConta;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="celular">Celular</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="celular"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.celular}
                  onChange={(e) => handleInputChange('celular', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termos"
                  checked={formData.aceitaTermos}
                  onCheckedChange={(checked) => handleInputChange('aceitaTermos', checked)}
                />
                <Label htmlFor="termos" className="text-sm">
                  Aceito os termos e condições
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacidade"
                  checked={formData.aceitaPrivacidade}
                  onCheckedChange={(checked) => handleInputChange('aceitaPrivacidade', checked)}
                />
                <Label htmlFor="privacidade" className="text-sm">
                  Aceito a política de privacidade
                </Label>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 text-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Verificação por SMS</h3>
              <p className="text-gray-600 text-sm">
                Enviamos um código de 6 dígitos para {formData.celular}
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={formData.codigo}
                onChange={(value) => handleInputChange('codigo', value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button className="text-purple-600 hover:text-purple-700 text-sm">
              Reenviar código
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  className="pr-10"
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

            <div>
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmarSenha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  value={formData.confirmarSenha}
                  onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Tipo de pessoa</Label>
              <RadioGroup value={formData.tipoPessoa} onValueChange={(value) => handleInputChange('tipoPessoa', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="fisica" />
                  <Label htmlFor="fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.tipoPessoa === 'juridica' && (
              <>
                <Input
                  placeholder="CNPJ"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                />
                <Input
                  placeholder="Inscrição Estadual"
                  value={formData.inscricaoEstadual}
                  onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                />
                <Input
                  placeholder="Inscrição Municipal"
                  value={formData.inscricaoMunicipal}
                  onChange={(e) => handleInputChange('inscricaoMunicipal', e.target.value)}
                />
                <Input
                  placeholder="Razão Social"
                  value={formData.razaoSocial}
                  onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
                />
                <Input
                  placeholder="Nome Fantasia"
                  value={formData.nomeFantasia}
                  onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
                />
              </>
            )}

            {formData.tipoPessoa === 'fisica' && (
              <Input
                placeholder="CPF"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
              />
            )}

            <Input
              placeholder="Hora limite de coleta"
              value={formData.horaLimiteColeta}
              onChange={(e) => handleInputChange('horaLimiteColeta', e.target.value)}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Input
              placeholder="CEP"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
            />
            <Input
              placeholder="Estado"
              value={formData.estado}
              onChange={(e) => handleInputChange('estado', e.target.value)}
            />
            <Input
              placeholder="Cidade"
              value={formData.cidade}
              onChange={(e) => handleInputChange('cidade', e.target.value)}
            />
            <Input
              placeholder="Bairro"
              value={formData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
            />
            <Input
              placeholder="Logradouro"
              value={formData.logradouro}
              onChange={(e) => handleInputChange('logradouro', e.target.value)}
            />
            <Input
              placeholder="Número"
              value={formData.numero}
              onChange={(e) => handleInputChange('numero', e.target.value)}
            />
            <Input
              placeholder="Complemento"
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Banco"
              value={formData.banco}
              onChange={(e) => handleInputChange('banco', e.target.value)}
            />
            <Input
              placeholder="Agência"
              value={formData.agencia}
              onChange={(e) => handleInputChange('agencia', e.target.value)}
            />
            <Input
              placeholder="Conta"
              value={formData.conta}
              onChange={(e) => handleInputChange('conta', e.target.value)}
            />
            <Input
              placeholder="Titularidade"
              value={formData.titularidade}
              onChange={(e) => handleInputChange('titularidade', e.target.value)}
            />
            
            <div>
              <Label>Tipo de conta</Label>
              <RadioGroup value={formData.tipoConta} onValueChange={(value) => handleInputChange('tipoConta', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="corrente" id="corrente" />
                  <Label htmlFor="corrente">Conta Corrente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poupanca" id="poupanca" />
                  <Label htmlFor="poupanca">Conta Poupança</Label>
                </div>
              </RadioGroup>
            </div>

            <Input
              placeholder="Chave PIX"
              value={formData.chavePix}
              onChange={(e) => handleInputChange('chavePix', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Dados pessoais';
      case 2: return 'Verificação';
      case 3: return 'Defina sua senha';
      case 4: return 'Dados gerais';
      case 5: return 'Endereço';
      case 6: return 'Dados bancários';
      default: return '';
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">{getStepTitle()}</h1>
          <p className="text-sm text-gray-600">Etapa {currentStep} de 6</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {currentStep === 6 ? 'Finalizar' : 'Próximo'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UsuarioTipoPonto;
