import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

const DashboardCliente = () => {
  return (
    <DashboardLayout userRole="cliente">
      <Routes>
        <Route path="/" element={<ClienteOverview />} />
        <Route path="/mis-cotizaciones" element={<MisCotizaciones />} />
        <Route path="/servicios-contratados" element={<ServiciosContratados />} />
        <Route path="/mi-perfil" element={<MiPerfil />} />
      </Routes>
    </DashboardLayout>
  );
};

const ClienteOverview = () => {
  const { user } = useAuth();

  const { data: cotizacionesCount } = useQuery({
    queryKey: ['cliente-cotizaciones-count', user?.id],
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

  const { data: trabajosCount } = useQuery({
    queryKey: ['cliente-trabajos-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id)
        .eq('estado', 'trabajo-contratado');
      return count || 0;
    },
    enabled: !!user
  });

  const stats = [
    { title: "Cotizaciones", value: cotizacionesCount?.toString() || "0", icon: FileText, color: "text-blue-600" },
    { title: "Servicios Contratados", value: trabajosCount?.toString() || "0", icon: Briefcase, color: "text-green-600" },
    { title: "Productos en Carrito", value: "0", icon: ShoppingCart, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-arte-title mb-2">Panel de Cliente</h1>
        <p className="text-sm sm:text-base text-arte-subtitle">Gestiona tus cotizaciones y servicios contratados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-arte-subtitle">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-arte-title">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-arte-title">Bienvenido a tu Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 sm:p-8">
            <p className="text-sm sm:text-base text-arte-subtitle mb-4">
              Desde aquí puedes gestionar todas tus interacciones con Arte Estufas:
            </p>
            <ul className="text-xs sm:text-sm text-arte-subtitle space-y-2 text-left max-w-sm mx-auto">
              <li>✓ Ver el estado de tus cotizaciones en tiempo real</li>
              <li>✓ Seguir el progreso de tus servicios contratados</li>
              <li>✓ Revisar tu historial completo</li>
              <li>✓ Contactar nuestro equipo de soporte</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MisCotizaciones = () => {
  const { user } = useAuth();

  const { data: cotizaciones } = useQuery({
    queryKey: ['mis-cotizaciones', user?.id],
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
        <CardTitle className="text-lg sm:text-xl text-arte-title">Mis Cotizaciones</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {cotizaciones?.map((cotizacion: any) => (
            <div key={cotizacion.id} className="border rounded p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-arte-title">
                    Cotización #{cotizacion.id.slice(0, 8)}
                  </h3>
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Fecha: {new Date(cotizacion.fecha_solicitud).toLocaleDateString()}
                  </p>
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Departamento: {cotizacion.departamento}
                  </p>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">
                    Dirección: {cotizacion.direccion_envio}
                  </p>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
                  cotizacion.estado === 'cotizacion-pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  cotizacion.estado === 'cotizacion-hecha' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {cotizacion.estado === 'cotizacion-pendiente' ? 'Pendiente' :
                   cotizacion.estado === 'cotizacion-hecha' ? 'Cotización Lista' :
                   'Trabajo Contratado'}
                </span>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Productos cotizados:</h4>
                {cotizacion.cotizacion_productos?.map((item: any, index: number) => (
                  <div key={index} className="text-xs sm:text-sm text-arte-subtitle mb-1">
                    • {item.productos?.nombre} - Cantidad: {item.cantidad}
                    <br />
                    <span className="text-xs text-gray-400">
                      Código: {item.productos?.codigo_referencia}
                    </span>
                  </div>
                ))}
              </div>
              {cotizacion.comentarios_adicionales && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Comentarios:</h4>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">{cotizacion.comentarios_adicionales}</p>
                </div>
              )}
            </div>
          ))}
          {(!cotizaciones || cotizaciones.length === 0) && (
            <p className="text-center text-arte-subtitle py-8 text-sm sm:text-base">No tienes cotizaciones registradas</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ServiciosContratados = () => {
  const { user } = useAuth();

  const { data: serviciosContratados } = useQuery({
    queryKey: ['servicios-contratados', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          trabajos(
            id,
            fecha_asignacion,
            observaciones
          ),
          cotizacion_productos(
            cantidad,
            productos(nombre, codigo_referencia)
          )
        `)
        .eq('usuario_id', user.id)
        .eq('estado', 'trabajo-contratado')
        .order('fecha_solicitud', { ascending: false });
      return data || [];
    },
    enabled: !!user
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl text-arte-title">Servicios Contratados</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {serviciosContratados?.map((servicio: any) => (
            <div key={servicio.id} className="border rounded p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-arte-title">
                    Cotización #{servicio.id.slice(0, 8)}
                  </h3>
                  {servicio.trabajos?.[0] && (
                    <p className="text-xs sm:text-sm text-arte-subtitle">
                      Trabajo: #{servicio.trabajos[0].id.slice(0, 8)}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Fecha solicitud: {new Date(servicio.fecha_solicitud).toLocaleDateString()}
                  </p>
                  {servicio.trabajos?.[0]?.fecha_asignacion && (
                    <p className="text-xs sm:text-sm text-arte-subtitle">
                      Fecha asignación: {new Date(servicio.trabajos[0].fecha_asignacion).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Departamento: {servicio.departamento}
                  </p>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">
                    Dirección: {servicio.direccion_envio}
                  </p>
                </div>
                <span className="px-2 sm:px-3 py-1 rounded bg-green-100 text-green-800 text-xs sm:text-sm whitespace-nowrap">
                  Trabajo Contratado
                </span>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Productos/Servicios:</h4>
                {servicio.cotizacion_productos?.map((item: any, index: number) => (
                  <div key={index} className="text-xs sm:text-sm text-arte-subtitle">
                    • {item.productos?.nombre} (Cantidad: {item.cantidad})
                  </div>
                ))}
              </div>
              {servicio.trabajos?.[0]?.observaciones && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Observaciones del trabajo:</h4>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">{servicio.trabajos[0].observaciones}</p>
                </div>
              )}
              {servicio.comentarios_adicionales && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Comentarios adicionales:</h4>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">{servicio.comentarios_adicionales}</p>
                </div>
              )}
            </div>
          ))}
          {(!serviciosContratados || serviciosContratados.length === 0) && (
            <p className="text-center text-arte-subtitle py-8 text-sm sm:text-base">No tienes servicios contratados</p>
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
        <CardTitle className="text-lg sm:text-xl text-arte-title">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {userProfile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Nombre</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.nombre}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Apellido</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.apellido}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Tipo de Documento</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.tipo_documento}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Número de Documento</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.cedula}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Teléfono</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.telefono || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">País</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.pais || 'No registrado'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs sm:text-sm font-medium text-arte-title">Dirección</label>
                <p className="text-sm sm:text-base text-arte-subtitle break-words">{userProfile.direccion || 'No registrada'}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Departamento</label>
                <p className="text-sm sm:text-base text-arte-subtitle">{userProfile.departamento || 'No registrado'}</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-arte-title">Rol</label>
                <span className={`px-2 py-1 rounded text-xs sm:text-sm ${
                  userProfile.rol === 'admin' ? 'bg-red-100 text-red-800' :
                  userProfile.rol === 'cliente' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile.rol}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="text-xs sm:text-sm font-medium text-arte-title">Fecha de Registro</label>
              <p className="text-sm sm:text-base text-arte-subtitle">
                {new Date(userProfile.fecha_registro).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-arte-subtitle py-8 text-sm sm:text-base">Cargando información del perfil...</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCliente;
