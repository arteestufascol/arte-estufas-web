
import { Link } from 'react-router-dom';
import { X, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const CookieBanner = () => {
  const { showBanner, loading, acceptCookies, rejectCookies } = useCookieConsent();

  if (loading || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-50">
      <Card className="max-w-4xl mx-auto bg-[#D8CFC4] border-[#A0522D] shadow-2xl">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="text-[#4E3B31] text-sm md:text-base leading-relaxed">
                🍪 <strong>Usamos cookies</strong> para brindarte una mejor experiencia. 
                Al continuar, aceptas nuestra{' '}
                <Link 
                  to="/politica-privacidad" 
                  className="text-[#7C5B4B] underline hover:text-[#A0522D] transition-colors"
                >
                  Política de Privacidad
                </Link>.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={acceptCookies}
                className="bg-[#A0522D] hover:bg-[#8B4A28] text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Check size={16} />
                Aceptar cookies
              </Button>
              
              <Link to="/politica-privacidad">
                <Button
                  variant="ghost"
                  className="text-[#7C5B4B] hover:text-[#A0522D] hover:bg-[#4E3B31]/10 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto"
                >
                  <FileText size={16} />
                  Ver políticas
                </Button>
              </Link>
              
              <Button
                onClick={rejectCookies}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <X size={16} />
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CookieBanner;
