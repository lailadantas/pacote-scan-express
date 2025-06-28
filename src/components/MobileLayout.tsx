
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut } from 'lucide-react';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  showProfileMenu?: boolean;
  onBackClick?: () => void;
}

const MobileLayout = ({ 
  children, 
  title, 
  showBackButton = false, 
  showBottomNav = true,
  showProfileMenu = false,
  onBackClick
}: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackNavigation = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }

    // Navegação customizada baseada na tela atual
    if (location.pathname.includes('/detalhedoservico/')) {
      navigate('/meusservicos');
    } else if (location.pathname === '/meusservicos') {
      navigate('/home');
    } else if (location.pathname === '/bipagem') {
      navigate('/home');
    } else if (location.pathname === '/estoque') {
      navigate('/home');
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={handleBackNavigation}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f3d54219-8523-4c16-a475-30845e2fd8bf.png" 
              alt="SmartPonto" 
              className="h-8 mr-2"
            />
            <h1 className="text-lg font-semibold text-gray-900">
              {title || 'SmartPonto'}
            </h1>
          </div>
        </div>
        
        {showProfileMenu && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/perfil')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;
