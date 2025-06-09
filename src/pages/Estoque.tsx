
import MobileLayout from '@/components/MobileLayout';

const Estoque = () => {
  return (
    <MobileLayout title="Estoque">
      <div className="p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Estoque
          </h2>
          <p className="text-gray-600">
            Aqui aparecerão os pacotes finalizados da bipagem.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Estoque;
