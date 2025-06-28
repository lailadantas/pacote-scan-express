
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import PacotesBipados from '@/components/PacotesBipados';
import BipagemHeader from '@/components/BipagemHeader';
import BipagemActions from '@/components/BipagemActions';
import BipagemToastManager from '@/components/BipagemToastManager';
import { useBipagemLogic } from '@/hooks/useBipagemLogic';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Bipagem = () => {
  const navigate = useNavigate();
  const {
    pacotes,
    isScannerActive,
    showDeleteDialog,
    pendingCode,
    toast,
    getTitulo,
    handleCodeDetected,
    handleDeleteConfirm,
    handleDeleteCancel,
    removePacote,
    handleDigitarCodigo,
    finalizarBipagem,
    setToast,
    setShowDeleteDialog
  } = useBipagemLogic();

  return (
    <>
      <MobileLayout 
        title={getTitulo()} 
        showBackButton 
        showBottomNav={false}
        onBackClick={() => navigate('/home')}
      >
        <div className="flex flex-col h-full">
          <BipagemHeader 
            onCodeDetected={handleCodeDetected}
            isScannerActive={isScannerActive}
          />

          <BipagemActions
            onDigitarCodigo={handleDigitarCodigo}
            onFinalizarBipagem={finalizarBipagem}
          />

          <PacotesBipados 
            pacotes={pacotes}
            onRemovePacote={removePacote}
            defaultExpanded={true}
          />
        </div>
      </MobileLayout>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Item já foi bipado</AlertDialogTitle>
            <AlertDialogDescription>
              O código {pendingCode} já foi bipado anteriormente. Deseja remover este item da lista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sim, remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BipagemToastManager
        toast={toast}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default Bipagem;
