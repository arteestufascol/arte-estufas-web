import { Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, FileText, Briefcase } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import CreateProductPage from "./components/CreateProductPage";
import EditProductPage from "./components/EditProductPage";
import CotizacionesManager from "@/components/CotizacionesManager";
import CuponesPage from "./components/CuponesPage";
import { useEffect } from "react";

const DashboardAdmin = () => {
  return (
    <DashboardLayout userRole="admin">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/producto" element={<CreateProductPage />} />
        <Route path="/editar-producto" element={<EditProductPage />} />
        <Route path="/cotizaciones" element={<CotizacionesManager />} />
        <Route path="/trabajos" element={<TrabajosManager />} />
        <Route path="/usuarios" element={<UsuariosManager />} />
        <Route path="/cupones" element={<CuponesPage />} />
      </Routes>
    </DashboardLayout>
  );
};

const AdminOverview = () => {
  const { data: productosCount, refetch: refetchProductos } = useQuery({
    queryKey: ['productos-count'],
    queryFn: async () => {
      const { count } = await supabase.from('productos').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: usuariosCount, refetch: refetchUsuarios } = useQuery({
    queryKey: ['usuarios-count'],
    queryFn: async () => {
      const { count } = await supabase.from('usuarios').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: cotizacionesCount, refetch: refetchCotizaciones } = useQuery({
    queryKey: ['cotizaciones-count'],
    queryFn: async () => {
      const { count } = await supabase.from('cotizaciones').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: trabajosCount, refetch: refetchTrabajos } = useQuery({
    queryKey: ['trabajos-count'],
    queryFn: async () => {
      const { count } = await supabase.from('cotizaciones').select('*', { count: 'exact', head: true }).eq('estado', 'trabajo-contratado');
      return count || 0;
    }
  });

  useEffect(() => {
    const cotizacionesChannel = supabase
      .channel('cotizaciones-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cotizaciones'
        },
        () => {
          refetchCotizaciones();
          refetchTrabajos();
        }
      )
      .subscribe();

    const productosChannel = supabase
      .channel('productos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productos'
        },
        () => {
          refetchProductos();
        }
      )
      .subscribe();

    const usuariosChannel = supabase
      .channel('usuarios-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'usuarios'
        },
        () => {
          refetchUsuarios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cotizacionesChannel);
      supabase.removeChannel(productosChannel);
      supabase.removeChannel(usuariosChannel);
    };
  }, [refetchCotizaciones, refetchProductos, refetchUsuarios, refetchTrabajos]);

  const stats = [
    { title: "Productos", value: productosCount?.toString() || "0", icon: Package, color: "text-blue-600" },
    { title: "Usuarios", value: usuariosCount?.toString() || "0", icon: Users, color: "text-green-600" },
    { title: "Cotizaciones", value: cotizacionesCount?.toString() || "0", icon: FileText, color: "text-yellow-600" },
    { title: "Trabajos", value: trabajosCount?.toString() || "0", icon: Briefcase, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-arte-title mb-2">Panel de Administración</h1>
        <p className="text-sm lg:text-base text-arte-subtitle">Gestiona productos, usuarios y cotizaciones</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm text-arte-subtitle">{stat.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-arte-title">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-arte-title text-lg lg:text-xl">Panel de Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 lg:p-8">
              <p className="text-sm lg:text-base text-arte-subtitle mb-4">
                Sistema de gestión completamente funcional:
              </p>
              <ul className="text-xs lg:text-sm text-arte-subtitle space-y-2 text-left max-w-sm mx-auto">
                <li>✓ Gestión de productos en tiempo real</li>
                <li>✓ Sistema de cotizaciones activo</li>
                <li>✓ Control de usuarios y roles</li>
                <li>✓ Seguimiento de trabajos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const { data: recentCotizaciones, refetch } = useQuery({
    queryKey: ['recent-cotizaciones'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          usuarios(nombre, apellido)
        `)
        .order('fecha_solicitud', { ascending: false })
        .limit(5);
      return data || [];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('recent-activity')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cotizaciones'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title text-lg lg:text-xl">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentCotizaciones?.map((cotizacion: any) => (
            <div key={cotizacion.id} className="flex justify-between items-center p-2 lg:p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-arte-title text-sm lg:text-base">
                  {cotizacion.usuarios?.nombre} {cotizacion.usuarios?.apellido}
                </p>
                <p className="text-xs lg:text-sm text-arte-subtitle">
                  Cotización #{cotizacion.id.slice(0, 8)}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                cotizacion.estado === 'cotizacion-pendiente' ? 'bg-yellow-100 text-yellow-800' :
                cotizacion.estado === 'cotizacion-hecha' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {cotizacion.estado === 'cotizacion-pendiente' ? 'Pendiente' :
                 cotizacion.estado === 'cotizacion-hecha' ? 'Lista' :
                 'Contratada'}
              </span>
            </div>
          ))}
          {(!recentCotizaciones || recentCotizaciones.length === 0) && (
            <p className="text-center text-arte-subtitle py-4 text-sm lg:text-base">No hay actividad reciente</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ProductosManager = () => {
  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const { data } = await supabase.from('productos').select('*').order('fecha_creacion', { ascending: false });
      return data || [];
    }
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Gestión de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos?.map((producto: any) => (
            <div key={producto.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-arte-title">{producto.nombre}</h3>
                  <p className="text-arte-subtitle">Código: {producto.codigo_referencia}</p>
                  <p className="text-arte-subtitle">{producto.descripcion}</p>
                  {producto.precio && (
                    <p className="text-green-600 font-medium">Precio: ${producto.precio}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    producto.preguntar_cotizacion ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {producto.preguntar_cotizacion ? 'Cotización' : 'Precio fijo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!productos || productos.length === 0) && (
            <p className="text-center text-arte-subtitle py-8">No hay productos registrados</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TrabajosManager = () => {
  const { data: trabajosContratados } = useQuery({
    queryKey: ['trabajos-contratados-admin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          usuarios(nombre, apellido),
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
        .eq('estado', 'trabajo-contratado')
        .order('fecha_solicitud', { ascending: false });
      return data || [];
    }
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Gestión de Trabajos Contratados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trabajosContratados?.map((cotizacion: any) => (
            <div key={cotizacion.id} className="border rounded p-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-arte-title">
                    Cotización #{cotizacion.id.slice(0, 8)}
                  </h3>
                  {cotizacion.trabajos?.[0] && (
                    <p className="text-xs sm:text-sm text-arte-subtitle">
                      Trabajo: #{cotizacion.trabajos[0].id.slice(0, 8)}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Cliente: {cotizacion.usuarios?.nombre} {cotizacion.usuarios?.apellido}
                  </p>
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Fecha solicitud: {new Date(cotizacion.fecha_solicitud).toLocaleDateString()}
                  </p>
                  {cotizacion.trabajos?.[0]?.fecha_asignacion && (
                    <p className="text-xs sm:text-sm text-arte-subtitle">
                      Fecha asignación: {new Date(cotizacion.trabajos[0].fecha_asignacion).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-arte-subtitle">
                    Departamento: {cotizacion.departamento}
                  </p>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">
                    Dirección: {cotizacion.direccion_envio}
                  </p>
                </div>
                <span className="px-2 sm:px-3 py-1 rounded bg-green-100 text-green-800 text-xs sm:text-sm whitespace-nowrap">
                  Trabajo Contratado
                </span>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2 text-sm sm:text-base">Productos/Servicios:</h4>
                {cotizacion.cotizacion_productos?.map((item: any, index: number) => (
                  <div key={index} className="text-xs sm:text-sm text-arte-subtitle">
                    • {item.productos?.nombre} (Cantidad: {item.cantidad})
                  </div>
                ))}
              </div>
              {cotizacion.trabajos?.[0]?.observaciones && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Observaciones del trabajo:</h4>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">{cotizacion.trabajos[0].observaciones}</p>
                </div>
              )}
              {cotizacion.comentarios_adicionales && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2 text-sm sm:text-base">Comentarios adicionales:</h4>
                  <p className="text-xs sm:text-sm text-arte-subtitle break-words">{cotizacion.comentarios_adicionales}</p>
                </div>
              )}
            </div>
          ))}
          {(!trabajosContratados || trabajosContratados.length === 0) && (
            <p className="text-center text-arte-subtitle py-8 text-sm sm:text-base">No hay trabajos contratados</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const UsuariosManager = () => {
  const { data: usuarios } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('usuarios')
        .select('*')
        .order('fecha_registro', { ascending: false });
      return data || [];
    }
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-arte-title">Gestión de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usuarios?.map((usuario: any) => (
            <div key={usuario.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-arte-title">
                    {usuario.nombre} {usuario.apellido}
                  </h3>
                  <p className="text-arte-subtitle">
                    {usuario.tipo_documento}: {usuario.cedula}
                  </p>
                  <p className="text-arte-subtitle">
                    Teléfono: {usuario.telefono || 'No registrado'}
                  </p>
                  <p className="text-arte-subtitle">
                    Dirección: {usuario.direccion || 'No registrada'}
                  </p>
                  <p className="text-arte-subtitle">
                    Registro: {new Date(usuario.fecha_registro).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded mb-2 block ${
                    usuario.rol === 'admin' ? 'bg-red-100 text-red-800' :
                    usuario.rol === 'cliente' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {usuario.rol}
                  </span>
                  <span className={`px-3 py-1 rounded ${
                    usuario.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!usuarios || usuarios.length === 0) && (
            <p className="text-center text-arte-subtitle py-8">No hay usuarios registrados</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardAdmin;
