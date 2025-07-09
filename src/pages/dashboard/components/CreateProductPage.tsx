
import React from 'react';
import ProductForm from '@/components/ProductForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateProductPage = () => {
  const handleProductCreated = () => {
    // Se puede expandir para hacer algo después de crear el producto
    console.log('Producto creado exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-arte-title mb-2">
          Crear Nuevo Producto
        </h1>
        <p className="text-sm lg:text-base text-arte-subtitle">
          Agrega un nuevo producto al catálogo de Arte Estufas
        </p>
      </div>

      <ProductForm onSuccess={handleProductCreated} />

      {/* Información adicional */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 space-y-2">
          <p>• Los campos marcados con (*) son obligatorios</p>
          <p>• El código de referencia debe ser único para cada producto</p>
          <p>• Las imágenes deben ser menores a 5MB</p>
          <p>• Si marcas "Requiere cotización", el producto no tendrá precio fijo</p>
          <p>• Los productos se mostrarán automáticamente en el catálogo público</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProductPage;
