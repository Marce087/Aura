import { X, Check, Plus } from 'lucide-react';
import { BeautyProduct, RoutinePeriod } from '../data/beautyData';
import { ResilientImage } from './ResilientImage';

interface ProductModalProps {
  product: BeautyProduct | null;
  onClose: () => void;
  onAddToBag: (product: BeautyProduct) => void;
  onAddToRoutine: (product: BeautyProduct, period: RoutinePeriod) => void;
  justAddedId: string | null;
}

export function ProductModal({
  product,
  onClose,
  onAddToBag,
  onAddToRoutine,
  justAddedId,
}: ProductModalProps) {
  if (!product) return null;

  const isJustAdded = justAddedId === product.id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de producto"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-md bg-white/90 text-stone-700 hover:text-stone-900 border border-stone-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-stone-100 aspect-[4/3] md:aspect-auto md:h-full">
          <ResilientImage
            src={product.image}
            alt={product.name}
            fallbackLabel={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.volume}</span>
              <span aria-hidden="true">·</span>
              <span>{product.availability}</span>
            </div>

            <div>
              <h2
                id="modal-product-title"
                className="font-display text-3xl font-medium text-stone-900 leading-tight"
              >
                {product.name}
              </h2>
              <p className="mt-2 text-lg font-medium text-stone-900 tabular-nums">
                ${product.price.toFixed(2)} USD
              </p>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="pt-3 border-t border-stone-200 space-y-2.5 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Ingredientes clave</span>
                <span className="text-stone-800 text-right font-medium">
                  {product.ingredients.join(' · ')}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Tipo de piel</span>
                <span className="text-stone-800 text-right">
                  {product.skinTypes.join(', ')}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-stone-500">Uso sugerido</span>
                <span className="text-stone-800 text-right">
                  {product.recommendedPeriod === 'AM'
                    ? 'Rutina de Mañana'
                    : product.recommendedPeriod === 'PM'
                      ? 'Rutina de Noche'
                      : 'Mañana y Noche'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={() => onAddToBag(product)}
              className="w-full py-3 px-4 bg-stone-900 text-stone-50 text-sm font-medium rounded-md hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 min-h-[44px]"
            >
              {isJustAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Agregado a la bolsa</span>
                </>
              ) : (
                <span>Agregar a la bolsa</span>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onAddToRoutine(product, 'AM')}
                className="py-2.5 px-3 border border-stone-200 text-stone-700 text-xs font-medium rounded-md hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir a Mañana</span>
              </button>
              <button
                type="button"
                onClick={() => onAddToRoutine(product, 'PM')}
                className="py-2.5 px-3 border border-stone-200 text-stone-700 text-xs font-medium rounded-md hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir a Noche</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
