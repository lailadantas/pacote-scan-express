
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Headphones, Package, MessageCircle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
}

const MobileLayout = ({ 
  children, 
  title, 
  showBackButton = false, 
  showBottomNav = true 
}: MobileLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: location.pathname === '/' },
    { icon: Headphones, label: 'Serviços', path: '/servicos', active: location.pathname === '/servicos' },
    { icon: Package, label: 'Estoque', path: '/estoque', active: location.pathname === '/estoque' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', active: location.pathname === '/chat' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro', active: location.pathname === '/financeiro' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900">
          {title || 'ExpediApp'}
        </h1>
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
