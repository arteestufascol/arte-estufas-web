
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  userProfile: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

  const refreshProfile = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      console.log('No user ID provided for profile refresh');
      setUserProfile(null);
      return;
    }
    
    if (profileLoading) {
      console.log('Profile already loading, skipping...');
      return;
    }
    
    setProfileLoading(true);
    try {
      console.log('Fetching profile for user:', targetUserId);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setUserProfile(null);
        return;
      }

      console.log('Profile data fetched successfully:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, 'User:', session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, fetching profile...');
          setTimeout(() => {
            if (isMounted) {
              refreshProfile(session.user.id);
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing profile');
          setUserProfile(null);
        }
        
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (isMounted) {
          console.log('Initial session user:', session?.user?.email || 'No user');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found, fetching profile...');
            await refreshProfile(session.user.id);
          } else {
            console.log('No user found, clearing profile');
            setUserProfile(null);
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log('Attempting signup with data:', { email, userData });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        let errorMessage = error.message;
        
        if (error.message.includes('User already registered')) {
          errorMessage = "Esta dirección de correo ya está registrada.";
        } else if (error.message.includes('Database error')) {
          errorMessage = "Error al crear la cuenta. Por favor intenta nuevamente.";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Dirección de correo electrónico inválida.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres.";
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = "El registro está deshabilitado. Contacta al administrador.";
        }
        
        toast({
          title: "Error de registro",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      if (data.user && !data.session) {
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu correo electrónico para completar el registro.",
        });
      } else {
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada correctamente.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup catch error:', error);
      toast({
        title: "Error de registro",
        description: "Error inesperado al crear la cuenta. Por favor intenta nuevamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting signin for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Signin response:', { data, error });

      if (error) {
        console.error('Signin error:', error);
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Por favor confirma tu correo electrónico antes de iniciar sesión.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Demasiados intentos. Por favor espera un momento.";
        } else if (error.message.includes('Invalid email')) {
          errorMessage = "Dirección de correo electrónico inválida.";
        }
        
        toast({
          title: "Error de autenticación",
          description: errorMessage,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signin catch error:', error);
      toast({
        title: "Error de autenticación",
        description: "Error inesperado al iniciar sesión. Por favor intenta nuevamente.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error",
          description: "Error al cerrar sesión. Intenta nuevamente.",
          variant: "destructive"
        });
      } else {
        console.log('User signed out successfully');
        setUser(null);
        setSession(null);
        setUserProfile(null);
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
        });
      }
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        title: "Error",
        description: "Error inesperado al cerrar sesión.",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    userProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
