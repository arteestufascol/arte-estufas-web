
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-arte-title text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-arte-button rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AE</span>
              </div>
              <span className="font-bold text-xl">Arte Estufas</span>
            </div>
            <p className="text-gray-300 text-sm">
              Especialistas en estufas de leña y hornos artesanales. 
              Calidad, diseño y calidez para tu hogar.
            </p>
          </div>

          {/* Enlaces legales */}
          <div>
            <h3 className="font-semibold mb-4">Información Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/acerca-de" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Acerca de
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacto" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link 
                  to="/politica-privacidad" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link 
                  to="/terminos-uso" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/politica-compra-devoluciones" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Política de compras y devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>Email: info@arteestufas.com</p>
              <p>Teléfono: +57 300 123 4567</p>
              <p>Dirección: Calle 123 #45-67<br />Bogotá, Colombia</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} Arte Estufas Rasmir. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
