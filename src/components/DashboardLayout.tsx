
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from './DashboardSidebar';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'cliente' | 'usuario';
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-arte-bg px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arte-button mx-auto mb-4"></div>
            <p className="text-arte-subtitle">Cargando panel...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arte-bg">
      <DashboardSidebar userRole={userRole} />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-2 sm:p-4 lg:p-6 xl:p-8">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
