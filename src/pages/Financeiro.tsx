
import MobileLayout from '@/components/MobileLayout';

const Financeiro = () => {
  return (
    <MobileLayout title="Financeiro">
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Financeiro
          </h2>
          <p className="text-gray-600">
            Informações financeiras serão exibidas aqui.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Financeiro;
