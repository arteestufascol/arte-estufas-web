
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tag, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiscountCodeFormProps {
  onApplyDiscount: (discount: number, code: string) => void;
  appliedDiscount?: { code: string; percentage: number };
  onRemoveDiscount: () => void;
}

const DiscountCodeForm = ({ onApplyDiscount, appliedDiscount, onRemoveDiscount }: DiscountCodeFormProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  // Códigos de descuento simulados (en producción estos vendrían de la base de datos)
  const validCodes = {
    'ARTE10': 10,
    'PROMO15': 15,
    'NAVIDAD20': 20,
    'VERANO25': 25,
  };

  const handleApplyCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Ingresa un código de descuento",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    // Simular validación
    setTimeout(() => {
      const upperCode = code.toUpperCase();
      const discount = validCodes[upperCode as keyof typeof validCodes];

      if (discount) {
        onApplyDiscount(discount, upperCode);
        toast({
          title: "¡Código aplicado!",
          description: `Descuento del ${discount}% aplicado correctamente`,
        });
        setCode('');
      } else {
        toast({
          title: "Código inválido",
          description: "El código de descuento no es válido o ha expirado",
          variant: "destructive",
        });
      }
      setIsValidating(false);
    }, 1000);
  };

  const handleRemoveCode = () => {
    onRemoveDiscount();
    toast({
      title: "Descuento removido",
      description: "El código de descuento ha sido removido",
    });
  };

  if (appliedDiscount) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Código aplicado: {appliedDiscount.code}
              </span>
              <span className="text-sm text-green-600">
                ({appliedDiscount.percentage}% descuento)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveCode}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-arte-button" />
            <span className="text-sm font-medium">¿Tienes un código de descuento?</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa tu código"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="flex-1"
              maxLength={20}
            />
            <Button
              onClick={handleApplyCode}
              disabled={isValidating || !code.trim()}
              variant="outline"
              size="sm"
            >
              {isValidating ? 'Validando...' : 'Aplicar'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Códigos disponibles: ARTE10, PROMO15, NAVIDAD20, VERANO25
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCodeForm;
