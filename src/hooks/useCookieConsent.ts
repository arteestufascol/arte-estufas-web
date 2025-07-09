
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CookieConsentData {
  decision: 'aceptado' | 'rechazado';
  timestamp: string;
}

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(true);

  const CONSENT_KEY = 'arteestufas_cookie_consent';

  useEffect(() => {
    checkConsentStatus();
  }, []);

  const checkConsentStatus = () => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        const consentData: CookieConsentData = JSON.parse(stored);
        // Si ya hay consentimiento guardado, no mostrar banner
        setShowBanner(false);
      } else {
        // No hay consentimiento, mostrar banner
        setShowBanner(true);
      }
    } catch (error) {
      console.error('Error checking consent status:', error);
      setShowBanner(true);
    } finally {
      setLoading(false);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error('Error getting IP:', error);
      return 'unknown';
    }
  };

  const generateSessionHash = (): string => {
    return crypto.randomUUID();
  };

  const saveConsent = async (decision: 'aceptado' | 'rechazado') => {
    try {
      const consentData: CookieConsentData = {
        decision,
        timestamp: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));

      // Obtener datos para la base de datos
      const ip = await getClientIP();
      const userAgent = navigator.userAgent;
      const sessionHash = generateSessionHash();

      // Guardar en base de datos
      const { error } = await supabase
        .from('consentimientos_cookies')
        .insert({
          ip_usuario: ip,
          decision: decision,
          user_agent: userAgent,
          sesion_hash: sessionHash
        });

      if (error) {
        console.error('Error saving consent to database:', error);
      }

      // Ocultar banner
      setShowBanner(false);
    } catch (error) {
      console.error('Error saving consent:', error);
      // Aún así ocultar el banner para no molestar al usuario
      setShowBanner(false);
    }
  };

  const acceptCookies = () => saveConsent('aceptado');
  const rejectCookies = () => saveConsent('rechazado');

  return {
    showBanner,
    loading,
    acceptCookies,
    rejectCookies
  };
};
