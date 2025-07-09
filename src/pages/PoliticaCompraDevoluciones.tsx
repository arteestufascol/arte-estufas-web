
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoliticaCompraDevoluciones = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-6 animate-fade-in">
            Política de Compras y Devoluciones
          </h1>
          <p className="text-lg text-arte-subtitle animate-fade-in">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg animate-slide-in">
            <CardHeader>
              <CardTitle className="text-arte-title">1. Proceso de compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">Cotizaciones</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Las cotizaciones son gratuitas y no generan compromiso de compra</li>
                <li>Tiempo de respuesta: máximo 48 horas hábiles</li>
                <li>Validez de la cotización: 30 días calendario</li>
                <li>Incluye: precio, especificaciones, tiempo de entrega y garantía</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Confirmación de pedido</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Se requiere anticipo del 50% para iniciar la fabricación</li>
                <li>El saldo se paga contra entrega del producto</li>
                <li>Aceptamos: efectivo, transferencias bancarias, tarjetas de crédito/débito</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">2. Tiempos de entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Productos en stock:</strong> 3-5 días hábiles</li>
                <li><strong>Productos bajo pedido:</strong> 15-30 días hábiles</li>
                <li><strong>Productos personalizados:</strong> 30-45 días hábiles</li>
                <li><strong>Instalación:</strong> se coordina por separado después de la entrega</li>
              </ul>
              <p className="mt-4">
                <strong>Nota:</strong> Los tiempos pueden variar según la complejidad del producto 
                y la disponibilidad de materiales. Te mantendremos informado sobre cualquier cambio.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">3. Entrega e instalación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">Entrega</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Entrega gratuita en Bogotá y municipios aledaños</li>
                <li>Para otras ciudades, se cotiza el costo de transporte</li>
                <li>Se coordina cita previa con el cliente</li>
                <li>Horario de entrega: lunes a viernes de 8:00 AM a 5:00 PM</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Instalación</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Servicio de instalación disponible con costo adicional</li>
                <li>Incluye: ubicación, conexión y prueba de funcionamiento</li>
                <li>Se proporciona manual de uso y mantenimiento</li>
                <li>Garantía de instalación: 6 meses</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">4. Garantía</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">Cobertura</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Estructura principal:</strong> 2 años</li>
                <li><strong>Componentes internos:</strong> 1 año</li>
                <li><strong>Acabados y pintura:</strong> 6 meses</li>
                <li><strong>Instalación:</strong> 6 meses</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">La garantía cubre</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Defectos de fabricación</li>
                <li>Fallas en materiales</li>
                <li>Problemas de funcionamiento por uso normal</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">La garantía NO cubre</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daños por uso inadecuado o negligencia</li>
                <li>Desgaste normal por uso</li>
                <li>Daños por factores externos (clima, accidentes)</li>
                <li>Modificaciones realizadas por terceros</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">5. Política de devoluciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">Productos estándar</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plazo: 15 días calendario desde la entrega</li>
                <li>Condición: producto sin usar, en empaque original</li>
                <li>Costo de devolución: a cargo del cliente</li>
                <li>Reembolso: 100% del valor pagado (menos costos de envío)</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Productos personalizados</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>No admiten devolución, excepto por defectos de fabricación</li>
                <li>En caso de defecto: reparación o reemplazo gratuito</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Proceso de devolución</h4>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contactar servicio al cliente: info@arteestufas.com</li>
                <li>Proporcionar número de pedido y motivo</li>
                <li>Recibir autorización de devolución</li>
                <li>Embalar producto según instrucciones</li>
                <li>Coordinar recogida o envío</li>
                <li>Reembolso en 5-10 días hábiles tras recepción</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">6. Cambios y modificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">Antes de la fabricación</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Se permiten cambios sin costo adicional</li>
                <li>Cambios que afecten el precio requieren nueva cotización</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Durante la fabricación</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cambios limitados según el avance del proyecto</li>
                <li>Pueden generar costos adicionales y demoras</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Después de la entrega</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modificaciones disponibles como servicio independiente</li>
                <li>Se cotiza según la complejidad del trabajo</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">7. Servicio posventa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Mantenimiento preventivo:</strong> disponible bajo cotización</li>
                <li><strong>Repuestos:</strong> disponibilidad garantizada por 5 años</li>
                <li><strong>Soporte técnico:</strong> asesoría telefónica gratuita</li>
                <li><strong>Reparaciones:</strong> servicio especializado</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">8. Contacto para reclamaciones</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>Para cualquier reclamo o consulta sobre tu compra:</p>
              <div className="mt-4 space-y-1">
                <p><strong>Email:</strong> info@arteestufas.com</p>
                <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                <p><strong>Horario de atención:</strong> Lunes a viernes, 8:00 AM - 6:00 PM</p>
                <p><strong>Tiempo de respuesta:</strong> máximo 24 horas hábiles</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCompraDevoluciones;
