
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, Package, MessageCircle, DollarSign, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  showProfileMenu?: boolean;
}

const MobileLayout = ({ 
  children, 
  title, 
  showBackButton = false, 
  showBottomNav = true,
  showProfileMenu = false
}: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackNavigation = () => {
    // Navegação customizada baseada na tela atual
    if (location.pathname.includes('/detalhedoservico/')) {
      navigate('/meusservicos');
    } else if (location.pathname === '/meusservicos') {
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

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: MapPin, label: 'Serviços', path: '/servicos', active: location.pathname === '/servicos' },
    { icon: Package, label: 'Estoque', path: '/estoque', active: location.pathname === '/estoque' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', active: location.pathname === '/chat' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro', active: location.pathname === '/financeiro' },
  ];

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
          <h1 className="text-lg font-semibold text-gray-900">
            {title || 'ExpediApp'}
          </h1>
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

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="bg-white border-t border-gray-200 px-2 py-2">
          <div className="flex justify-around">
            {navItems.map(({ icon: Icon, label, path, active }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                  active 
                    ? "text-orange-500 bg-orange-50" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileLayout;
