import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingCart, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

const DashboardUsuario = () => {
  return (
    <DashboardLayout userRole="usuario">
      <Routes>
        <Route path="/" element={<UsuarioOverview />} />
        <Route path="/mis-cotizaciones" element={<MisCotizacionesUsuario />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </DashboardLayout>
  );
};

const UsuarioOverview = () => {
  const { user } = useAuth();

  const { data: cotizacionesCount } = useQuery({
    queryKey: ['usuario-cotizaciones-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id);
      return count || 0;
    },
    enabled: !!user
  });

  const stats = [
    { title: "Cotizaciones", value: cotizacionesCount?.toString() || "0", icon: FileText, color: "text-blue-600" },
    { title: "Productos en Carrito", value: "0", icon: ShoppingCart, color: "text-yellow-600" },
    { title: "Perfil", value: "100%", icon: User, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-arte-title mb-2">Panel de Usuario</h1>
        <p className="text-arte-subtitle">Administra tu perfil y cotizaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-arte-subtitle">{stat.title}</p>
                  <p className="text-3xl font-bold text-arte-title">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-arte-title">Panel de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-arte-subtitle mb-4">
              Como usuario registrado puedes:
            </p>
            <ul className="text-sm text-arte-subtitle space-y-2 text-left max-w-sm mx-auto">
              <li>✓ Solicitar cotizaciones para productos</li>
              <li>✓ Agregar productos a tu carrito</li>
              <li>✓ Ver el estado de tus solicitudes en tiempo real</li>
              <li>✓ Actualizar tu información personal</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MisCotizacionesUsuario = () => {
  const { user } = useAuth();

  const { data: cotizaciones } = useQuery({
    queryKey: ['usuario-cotizaciones', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cotizacion_productos(
            cantidad,
            productos(nombre, codigo_referencia, descripcion)
          )
        `)
        .eq('usuario_id', user.id)
        .order('fecha_solicitud', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Mis Cotizaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cotizaciones?.map((cotizacion: any) => (
            <div key={cotizacion.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-arte-title">
                    Cotización #{cotizacion.id.slice(0, 8)}
                  </h3>
                  <p className="text-arte-subtitle">
                    Fecha: {new Date(cotizacion.fecha_solicitud).toLocaleDateString()}
                  </p>
                  <p className="text-arte-subtitle">
                    Departamento: {cotizacion.departamento}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded ${
                  cotizacion.estado === 'cotizacion-pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  cotizacion.estado === 'cotizacion-hecha' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {cotizacion.estado === 'cotizacion-pendiente' ? 'Pendiente' :
                   cotizacion.estado === 'cotizacion-hecha' ? 'Lista' :
                   'Contratada'}
                </span>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Productos:</h4>
                {cotizacion.cotizacion_productos?.map((item: any, index: number) => (
                  <div key={index} className="text-sm text-arte-subtitle">
                    • {item.productos?.nombre} - Cantidad: {item.cantidad}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {(!cotizaciones || cotizaciones.length === 0) && (
            <p className="text-center text-arte-subtitle py-8">No tienes cotizaciones registradas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MiPerfil = () => {
  const { userProfile } = useAuth();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        {userProfile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-arte-title">Nombre</label>
                <p className="text-arte-subtitle">{userProfile.nombre}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Apellido</label>
                <p className="text-arte-subtitle">{userProfile.apellido}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Tipo de Documento</label>
                <p className="text-arte-subtitle">{userProfile.tipo_documento}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Número de Documento</label>
                <p className="text-arte-subtitle">{userProfile.cedula}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Teléfono</label>
                <p className="text-arte-subtitle">{userProfile.telefono || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">País</label>
                <p className="text-arte-subtitle">{userProfile.pais || 'No registrado'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-arte-title">Dirección</label>
                <p className="text-arte-subtitle">{userProfile.direccion || 'No registrada'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Departamento</label>
                <p className="text-arte-subtitle">{userProfile.departamento || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-arte-title">Rol</label>
                <span className={`px-2 py-1 rounded text-sm ${
                  userProfile.rol === 'admin' ? 'bg-red-100 text-red-800' :
                  userProfile.rol === 'cliente' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile.rol}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="text-sm font-medium text-arte-title">Fecha de Registro</label>
              <p className="text-arte-subtitle">
                {new Date(userProfile.fecha_registro).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-arte-subtitle py-8">Cargando información del perfil...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardUsuario;
