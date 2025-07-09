
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AuthRedirectHandler from "./components/AuthRedirectHandler";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AcercaDe from "./pages/AcercaDe";
import Contacto from "./pages/Contacto";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import TerminosUso from "./pages/TerminosUso";
import PoliticaCompraDevoluciones from "./pages/PoliticaCompraDevoluciones";
import DashboardAdmin from "./pages/dashboard/DashboardAdmin";
import DashboardCliente from "./pages/dashboard/DashboardCliente";
import DashboardUsuario from "./pages/dashboard/DashboardUsuario";
import Error from "./pages/Error";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthRedirectHandler />
          <div className="min-h-screen bg-arte-bg flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo/arteestufas" element={<Catalogo />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/acerca-de" element={<AcercaDe />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                <Route path="/terminos-uso" element={<TerminosUso />} />
                <Route path="/politica-compra-devoluciones" element={<PoliticaCompraDevoluciones />} />
                <Route path="/error" element={<Error />} />
                <Route 
                  path="/dashboard/admin/*" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardAdmin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/cliente/*" 
                  element={
                    <ProtectedRoute allowedRoles={['cliente']}>
                      <DashboardCliente />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/usuario/*" 
                  element={
                    <ProtectedRoute allowedRoles={['usuario', 'cliente']}>
                      <DashboardUsuario />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
