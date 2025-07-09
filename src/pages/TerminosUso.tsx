
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TerminosUso = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-arte-title mb-6 animate-fade-in">
            Términos de Uso
          </h1>
          <p className="text-lg text-arte-subtitle animate-fade-in">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg animate-slide-in">
            <CardHeader>
              <CardTitle className="text-arte-title">1. Aceptación de términos</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Al acceder y utilizar el sitio web de Arte Estufas Rasmir, aceptas cumplir 
                y estar sujeto a estos términos de uso. Si no estás de acuerdo con alguno 
                de estos términos, no debes usar nuestro sitio web.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">2. Uso del sitio web</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Te comprometes a usar nuestro sitio web únicamente para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Consultar información sobre nuestros productos y servicios</li>
                <li>Realizar cotizaciones y pedidos legítimos</li>
                <li>Comunicarte con nosotros para consultas comerciales</li>
              </ul>
              <p><strong>No está permitido:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Usar el sitio para actividades ilegales o no autorizadas</li>
                <li>Intentar acceder a áreas restringidas o sistemas informáticos</li>
                <li>Enviar contenido malicioso, spam o virus</li>
                <li>Violar derechos de propiedad intelectual</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">3. Cuentas de usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Al crear una cuenta en nuestro sitio web:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Debes proporcionar información veraz y actualizada</li>
                <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
                <li>Debes notificarnos inmediatamente sobre uso no autorizado de tu cuenta</li>
                <li>Puedes eliminar tu cuenta en cualquier momento</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">4. Productos y precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <ul className="list-disc pl-6 space-y-2">
                <li>Los precios mostrados están en pesos colombianos (COP) e incluyen IVA</li>
                <li>Los precios pueden cambiar sin previo aviso</li>
                <li>Las cotizaciones tienen una validez de 30 días calendario</li>
                <li>Nos reservamos el derecho de rechazar pedidos por cualquier motivo</li>
                <li>La disponibilidad de productos puede variar</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">5. Proceso de cotización</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Para productos que requieren cotización:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Recibirás una respuesta dentro de 48 horas hábiles</li>
                <li>La cotización incluirá precios, tiempos de entrega y condiciones</li>
                <li>Los precios cotizados son válidos por 30 días</li>
                <li>Puedes solicitar modificaciones antes de la confirmación</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">6. Propiedad intelectual</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Todo el contenido de este sitio web, incluyendo textos, imágenes, logos, 
                diseños y código, es propiedad de Arte Estufas Rasmir y está protegido 
                por las leyes de propiedad intelectual. No puedes usar, copiar o distribuir 
                este contenido sin nuestro permiso expreso por escrito.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">7. Limitación de responsabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-arte-subtitle">
              <p>Arte Estufas Rasmir no será responsable por:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Daños directos, indirectos, incidentales o consecuenciales</li>
                <li>Pérdida de datos o interrupciones del servicio</li>
                <li>Errores u omisiones en el contenido del sitio web</li>
                <li>Virus u otros elementos dañinos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">8. Modificaciones</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios serán efectivos inmediatamente después de su publicación en 
                el sitio web. Es tu responsabilidad revisar periódicamente estos términos.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">9. Ley aplicable</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Estos términos se rigen por las leyes de la República de Colombia. 
                Cualquier disputa será resuelta en los tribunales competentes de Bogotá, D.C.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg animate-slide-in" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="text-arte-title">10. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="text-arte-subtitle">
              <p>
                Para preguntas sobre estos términos de uso, contáctanos:
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

export default TerminosUso;
