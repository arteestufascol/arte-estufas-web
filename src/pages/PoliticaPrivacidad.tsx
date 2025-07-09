
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-6 animate-fade-in">
            Política de Privacidad
          </h1>
          <p className="text-lg text-arte-subtitle animate-fade-in">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg animate-slide-in">
            <CardHeader>
              <CardTitle className="text-arte-title">1. Información que recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>
                En Arte Estufas Rasmir recopilamos la siguiente información personal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Información de identificación: nombre, apellidos, tipo y número de documento</li>
                <li>Información de contacto: dirección, correo electrónico, número de teléfono</li>
                <li>Información de ubicación: país, departamento/estado</li>
                <li>Información de navegación: cookies, dirección IP, datos de uso del sitio web</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">2. Cómo usamos tu información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Utilizamos tu información personal para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar tus cotizaciones y pedidos</li>
                <li>Comunicarnos contigo sobre productos y servicios</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Cumplir con obligaciones legales y fiscales</li>
                <li>Enviar comunicaciones promocionales (con tu consentimiento)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">3. Compartir información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, 
                excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Con proveedores de servicios que nos ayudan a operar nuestro negocio</li>
                <li>Cuando sea requerido por ley o por autoridades competentes</li>
                <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                <li>Con tu consentimiento explícito</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">4. Seguridad de datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para 
                proteger tu información personal contra:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceso no autorizado</li>
                <li>Alteración, divulgación o destrucción</li>
                <li>Pérdida accidental</li>
              </ul>
              <p>
                Sin embargo, ningún método de transmisión por Internet es 100% seguro, 
                por lo que no podemos garantizar la seguridad absoluta.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">5. Tus derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a tu información personal</li>
                <li>Rectificar datos inexactos o incompletos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Oponerte al procesamiento de tus datos</li>
                <li>Solicitar la portabilidad de tus datos</li>
                <li>Retirar tu consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, contáctanos en: info@arteestufas.com
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">6. Uso de Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <h4 className="font-semibold text-arte-title">¿Qué son las cookies?</h4>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
                cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia de navegación.
              </p>
              
              <h4 className="font-semibold text-arte-title">Tipos de cookies que utilizamos:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
                <li><strong>Cookies de funcionalidad:</strong> Recuerdan tus preferencias y configuraciones</li>
                <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo usas nuestro sitio</li>
                <li><strong>Cookies de marketing:</strong> Personalizan los anuncios según tus intereses</li>
              </ul>
              
              <h4 className="font-semibold text-arte-title">Control de cookies:</h4>
              <p>
                Puedes controlar y gestionar las cookies de varias maneras:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Configurar tu navegador para bloquear cookies</li>
                <li>Eliminar cookies existentes</li>
                <li>Usar el modo incógnito/privado de tu navegador</li>
                <li>Gestionar tus preferencias a través de nuestro banner de consentimiento</li>
              </ul>
              
              <p className="text-sm italic">
                Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad 
                y experiencia en nuestro sitio web.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">7. Cambios a esta política</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. 
                Te notificaremos sobre cambios importantes por correo electrónico 
                o mediante un aviso en nuestro sitio web.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">8. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Si tienes preguntas sobre esta política de privacidad o sobre el uso de cookies, contáctanos:
              </p>
              <div className="mt-4 space-y-1">
                <p><strong>Email:</strong> info@arteestufas.com</p>
                <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                <p><strong>Dirección:</strong> Calle 123 #45-67, Bogotá, Colombia</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;
