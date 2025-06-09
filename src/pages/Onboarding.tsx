
import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Package3D from '@/components/Package3D';

const OnboardingScene1 = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    <img 
      src="/lovable-uploads/bcae71b1-29e8-42b8-9f9f-4463b3075276.png" 
      alt="Bipagem Inteligente"
      className="max-w-full max-h-full object-contain"
    />
  </div>
);

const OnboardingScene2 = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    <img 
      src="/lovable-uploads/6c576fd1-60b2-4a95-a196-592b4688780a.png" 
      alt="Gestão de Rotas"
      className="max-w-full max-h-full object-contain"
    />
  </div>
);

const OnboardingScene3 = () => (
  <div className="w-full h-[300px] flex items-center justify-center">
    <img 
      src="/lovable-uploads/1a9c1056-a079-4473-9764-fc7066e31d36.png" 
      alt="Controle Total"
      className="max-w-full max-h-full object-contain"
    />
  </div>
);

const onboardingData = [
  {
    title: 'Bipagem Inteligente',
    description: 'Escaneie códigos de barras e QR codes de forma rápida e precisa. Nossa tecnologia garante 100% de precisão na identificação dos pacotes.',
    scene: OnboardingScene1
  },
  {
    title: 'Gestão de Rotas',
    description: 'Organize suas rotas de entrega e coleta de forma eficiente. O sistema otimiza automaticamente os percursos para economizar tempo e combustível.',
    scene: OnboardingScene2
  },
  {
    title: 'Controle Total',
    description: 'Monitore todo o estoque em tempo real. Acompanhe entregas, coletas e mantenha o controle total sobre seus pacotes.',
    scene: OnboardingScene3
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/auth');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    navigate('/auth');
  };

  const CurrentScene = onboardingData[currentStep].scene;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex space-x-2">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={skipOnboarding} className="text-gray-600">
          Pular
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col justify-center"
          >
            {/* Image Scene */}
            <div className="mb-8">
              <CurrentScene />
            </div>

            {/* Text Content */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {onboardingData[currentStep].title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
                {onboardingData[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>

        <Button
          onClick={nextStep}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
        >
          <span>{currentStep === onboardingData.length - 1 ? 'Começar' : 'Próximo'}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
