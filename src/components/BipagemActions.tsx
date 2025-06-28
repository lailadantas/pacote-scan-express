
interface BipagemActionsProps {
  onDigitarCodigo: () => void;
  onFinalizarBipagem: () => void;
}

const BipagemActions = ({ onDigitarCodigo, onFinalizarBipagem }: BipagemActionsProps) => {
  return (
    <div className="flex gap-3 mb-4 px-4">
      <button
        onClick={onDigitarCodigo}
        className="flex-1 bg-white border-2 border-orange-500 text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
      >
        Digitar código
      </button>
      <button
        onClick={onFinalizarBipagem}
        className="flex-1 bg-white border-2 border-orange-500 text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
      >
        Finalizar
      </button>
    </div>
  );
};

export default BipagemActions;
