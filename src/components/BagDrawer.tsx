import { useState, FormEvent } from 'react';
import { X, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { BeautyProduct } from '../data/beautyData';
import { ResilientImage } from './ResilientImage';

export interface BagItem {
  product: BeautyProduct;
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearBag: () => void;
}

const FREE_SHIPPING_THRESHOLD = 60;

export function BagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearBag,
}: BagDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    name: string;
    total: number;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6;
  const total = subtotal + shipping;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      return;
    }
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setConfirmedOrder({
      orderNumber: `AA-${randomCode}`,
      name: customerName.trim(),
      total,
    });
    onClearBag();
    setShowCheckout(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setShowCheckout(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Bolsa de compras"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col border-l border-stone-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium text-stone-900">
            Tu Bolsa
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar bolsa"
            className="w-10 h-10 flex items-center justify-center rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {confirmedOrder ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-stone-900 mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <p className="text-xs text-stone-500 tabular-nums">
                  Pedido #{confirmedOrder.orderNumber} confirmado
                </p>
                <h3 className="font-display text-2xl font-medium text-stone-900">
                  Gracias, {confirmedOrder.name}
                </h3>
              </div>
              <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
                Estamos preparando tus fórmulas botánicas. Total registrado:{' '}
                <span className="font-medium text-stone-900 tabular-nums">
                  ${confirmedOrder.total.toFixed(2)} USD
                </span>
                .
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-medium rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Seguir explorando
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-display text-2xl text-stone-900">
                Tu bolsa está vacía
              </p>
              <p className="text-sm text-stone-500 max-w-xs mx-auto">
                Explora nuestra selección esencial de limpieza, sérums e hidratación diaria.
              </p>
            </div>
          ) : showCheckout ? (
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-display text-xl font-medium text-stone-900">
                  Datos de entrega
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                >
                  Volver a la bolsa
                </button>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-stone-700"
                >
                  Nombre completo
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Sofía Mendoza"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-medium text-stone-700"
                >
                  Teléfono de contacto
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-stone-700"
                >
                  Dirección y código postal
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Calle, número, colonia y código postal"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-sm">
                <span className="text-stone-600">Total a pagar contra entrega</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ${total.toFixed(2)} USD
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-stone-900 text-stone-50 text-sm font-medium rounded-md hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px]"
              >
                Confirmar pedido
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-xs text-stone-600 pb-3 border-b border-stone-200">
                {remainingForFree === 0 ? (
                  <span>Envío gratuito incluido en tu pedido.</span>
                ) : (
                  <span>
                    Te faltan{' '}
                    <strong className="font-medium text-stone-900 tabular-nums">
                      ${remainingForFree.toFixed(2)} USD
                    </strong>{' '}
                    para envío gratuito.
                  </span>
                )}
              </div>

              <ul className="divide-y divide-stone-200">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="py-4 flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 shrink-0">
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackLabel={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-stone-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-xs text-stone-500">
                            {product.category} · {product.volume}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Eliminar ${product.name}`}
                          className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center border border-stone-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            aria-label={`Disminuir cantidad de ${product.name}`}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium text-stone-900 tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            aria-label={`Aumentar cantidad de ${product.name}`}
                            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-medium text-stone-900 tabular-nums">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {items.length > 0 && !showCheckout && !confirmedOrder && (
          <div className="px-6 py-5 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="tabular-nums">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Envío estándar</span>
                <span className="tabular-nums">
                  {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)} USD`}
                </span>
              </div>
              <div className="flex justify-between font-medium text-stone-900 pt-2 border-t border-stone-200">
                <span>Total estimado</span>
                <span className="tabular-nums">${total.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="w-full py-3 px-4 bg-stone-900 text-stone-50 text-sm font-medium rounded-md hover:bg-stone-800 transition-colors cursor-pointer min-h-[44px]"
            >
              Continuar al pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
