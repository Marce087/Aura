import { useState, useEffect, useMemo } from 'react';
import { Search, Check, ArrowRight } from 'lucide-react';
import {
  BEAUTY_PRODUCTS,
  DEFAULT_ROUTINE_STEPS,
  HERO_IMAGE,
  INGREDIENT_GLOSSARY,
  BeautyProduct,
  ProductCategory,
  RoutinePeriod,
  RoutineStep,
  SkinType,
} from './data/beautyData';
import { Header } from './components/Header';
import { ResilientImage } from './components/ResilientImage';
import { ProductModal } from './components/ProductModal';
import { BagDrawer, BagItem } from './components/BagDrawer';
import { RoutinePlanner } from './components/RoutinePlanner';

const CATEGORIES: ProductCategory[] = [
  'Todos',
  'Limpieza',
  'Sérums',
  'Hidratación',
  'Protección',
];

const SKIN_TYPES: SkinType[] = ['Todo tipo', 'Seca', 'Mixta', 'Sensible'];

const STORAGE_KEYS = {
  BAG: 'aura_botanica_bag_v1',
  ROUTINE: 'aura_botanica_routine_v1',
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkinGuide, setSelectedSkinGuide] = useState<SkinType>('Seca');

  const [selectedProduct, setSelectedProduct] = useState<BeautyProduct | null>(null);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activePeriod, setActivePeriod] = useState<RoutinePeriod>('AM');

  const [bagItems, setBagItems] = useState<BagItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BAG);
      return saved ? (JSON.parse(saved) as BagItem[]) : [];
    } catch {
      return [];
    }
  });

  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROUTINE);
      return saved ? (JSON.parse(saved) as RoutineStep[]) : DEFAULT_ROUTINE_STEPS;
    } catch {
      return DEFAULT_ROUTINE_STEPS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BAG, JSON.stringify(bagItems));
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routineSteps));
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, [routineSteps]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return BEAUTY_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        product.name.toLowerCase().includes(query) ||
        product.shortBenefit.toLowerCase().includes(query) ||
        product.ingredients.some((ing) => ing.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, searchQuery]);

  const recommendedForSkin = useMemo(() => {
    return BEAUTY_PRODUCTS.filter((p) => p.skinTypes.includes(selectedSkinGuide)).slice(0, 3);
  }, [selectedSkinGuide]);

  const totalBagCount = bagItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToBag = (product: BeautyProduct) => {
    setBagItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setJustAddedId(product.id);
    window.setTimeout(() => setJustAddedId(null), 1200);
    setToastMessage(`${product.name} agregado a tu bolsa.`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveBagItem = (productId: string) => {
    setBagItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearBag = () => {
    setBagItems([]);
  };

  const handleToggleRoutineStep = (stepId: string) => {
    setRoutineSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const handleAddProductToRoutine = (
    product: BeautyProduct,
    period: RoutinePeriod
  ) => {
    const periodSteps = routineSteps.filter((s) => s.period === period);
    const nextOrder =
      periodSteps.length > 0
        ? Math.max(...periodSteps.map((s) => s.order)) + 1
        : 1;

    const newStep: RoutineStep = {
      id: `${period.toLowerCase()}-${Date.now()}`,
      period,
      order: nextOrder,
      title: `${product.category}: ${product.name}`,
      productName: product.name,
      productId: product.id,
      note: product.shortBenefit,
      completed: false,
    };

    setRoutineSteps((prev) => [...prev, newStep]);
    setActivePeriod(period);
    setToastMessage(
      `${product.name} añadido a tu rutina de ${period === 'AM' ? 'mañana' : 'noche'}.`
    );
  };

  const handleAddCustomStep = (
    period: RoutinePeriod,
    title: string,
    note: string
  ) => {
    const periodSteps = routineSteps.filter((s) => s.period === period);
    const nextOrder =
      periodSteps.length > 0
        ? Math.max(...periodSteps.map((s) => s.order)) + 1
        : 1;

    const newStep: RoutineStep = {
      id: `custom-${Date.now()}`,
      period,
      order: nextOrder,
      title,
      productName: 'Cuidado personal',
      note,
      completed: false,
    };
    setRoutineSteps((prev) => [...prev, newStep]);
  };

  const handleRemoveRoutineStep = (stepId: string) => {
    setRoutineSteps((prev) => prev.filter((step) => step.id !== stepId));
  };

  const handleResetPeriod = (period: RoutinePeriod) => {
    setRoutineSteps((prev) =>
      prev.map((step) =>
        step.period === period ? { ...step, completed: false } : step
      )
    );
  };

  return (
    <div id="inicio" className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Header bagCount={totalBagCount} onOpenBag={() => setIsBagOpen(true)} />

      <main className="flex-1">
        {/* Hero Split */}
        <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium tracking-wide text-stone-500">
                Cuidado facial esencial · Formulación botánica
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-medium text-stone-900 leading-[1.08] tracking-tight">
                Belleza serena para tu piel de todos los días
              </h1>
              <p className="text-base text-stone-600 leading-relaxed max-w-xl">
                Una selección breve y honesta de limpiadores, sérums e hidratantes diseñados para mantener la barrera cutánea saludable sin rutinas complicadas.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#catalogo"
                  className="px-6 py-3 bg-stone-900 text-stone-50 text-sm font-medium rounded-md hover:bg-stone-800 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[44px]"
                >
                  <span>Explorar catálogo</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="#rutina"
                  className="px-5 py-3 text-sm font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
                >
                  Armar mi rutina
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] lg:h-full rounded-lg overflow-hidden bg-stone-200 border border-stone-200">
                <ResilientImage
                  src={HERO_IMAGE}
                  alt="Frascos minimalistas de sérum y crema facial sobre piedra travertina con luz natural"
                  fallbackLabel="Aura Botánica — Cuidado Facial"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-column commitment strip below hero split */}
          <div className="mt-14 pt-8 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="space-y-1">
              <p className="text-sm font-medium text-stone-900">Fórmulas puras</p>
              <p className="text-xs text-stone-500">
                Sin fragancias sintéticas ni parabenos.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-stone-900">Rutina simplificada</p>
              <p className="text-xs text-stone-500">
                Cuatro pasos claros de mañana y noche.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-stone-900">Envío gratuito</p>
              <p className="text-xs text-stone-500">
                En pedidos desde $60.00 USD.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-stone-900">Envase consciente</p>
              <p className="text-xs text-stone-500">
                Vidrio ámbar y cerámica reutilizable.
              </p>
            </div>
          </div>
        </section>

        {/* Catálogo de Productos */}
        <section
          id="catalogo"
          className="py-16 sm:py-20 border-t border-stone-200 bg-stone-50"
        >
          <div className="max-w-6xl mx-auto px-6 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-stone-500">
                  Colección Esencial
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-medium text-stone-900">
                  Fórmulas para cada paso
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar producto o ingrediente..."
                    aria-label="Buscar producto o ingrediente"
                    className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[40px]"
                  />
                </div>
              </div>
            </div>

            {/* Interactive filter tabs */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1"
              role="tablist"
              aria-label="Filtrar por categoría"
            >
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                      isActive
                        ? 'bg-stone-900 text-stone-50'
                        : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white border border-stone-200 rounded-lg space-y-3">
                <p className="font-display text-2xl text-stone-900">
                  No encontramos coincidencias
                </p>
                <p className="text-sm text-stone-500">
                  Prueba con otra palabra clave o vuelve a ver todas las categorías.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="px-4 py-2 text-xs font-medium bg-stone-900 text-stone-50 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isAdded = justAddedId === product.id;
                  return (
                    <article
                      key={product.id}
                      className="group flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="aspect-[4/3] w-full bg-stone-100 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stone-900"
                        aria-label={`Ver detalles de ${product.name}`}
                      >
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          fallbackLabel={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </button>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="text-xs text-stone-500 flex items-center gap-1.5">
                            <span>{product.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.volume}</span>
                          </div>
                          <h3 className="text-base font-semibold text-stone-900">
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              className="text-left hover:underline underline-offset-4 cursor-pointer"
                            >
                              {product.name}
                            </button>
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {product.shortBenefit}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-stone-900 tabular-nums">
                            ${product.price.toFixed(2)} USD
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                            >
                              Detalle
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToBag(product)}
                              className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-medium rounded-md hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Listo</span>
                                </>
                              ) : (
                                <span>Agregar</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Planificador Interactivo de Rutina */}
        <RoutinePlanner
          steps={routineSteps}
          activePeriod={activePeriod}
          onPeriodChange={setActivePeriod}
          onToggleStep={handleToggleRoutineStep}
          onAddCustomStep={handleAddCustomStep}
          onRemoveStep={handleRemoveRoutineStep}
          onResetPeriod={handleResetPeriod}
        />

        {/* Ingredientes y Guía por Tipo de Piel */}
        <section
          id="ingredientes"
          className="py-16 sm:py-20 border-t border-stone-200 bg-stone-50"
        >
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Ingredientes */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-stone-500">
                  Transparencia Activa
                </p>
                <h2 className="font-display text-3xl font-medium text-stone-900">
                  Ingredientes con propósito claro
                </h2>
              </div>

              <div className="border-t border-stone-200 divide-y divide-stone-200">
                {INGREDIENT_GLOSSARY.map((item) => (
                  <div key={item.name} className="py-4 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-base font-medium text-stone-900">
                        {item.name}
                      </h3>
                      <span className="text-xs text-stone-500 tabular-nums shrink-0">
                        {item.origin} · {item.concentration}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guía por Tipo de Piel */}
            <div id="guia" className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-stone-500">
                  Guía Rápida
                </p>
                <h2 className="font-display text-3xl font-medium text-stone-900">
                  Recomendación según tu piel
                </h2>
                <p className="text-sm text-stone-600">
                  Selecciona tu tipo de piel para ver las fórmulas más compatibles.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Tipo de piel"
              >
                {SKIN_TYPES.map((skin) => {
                  const active = selectedSkinGuide === skin;
                  return (
                    <button
                      key={skin}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedSkinGuide(skin)}
                      className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                        active
                          ? 'bg-stone-900 text-stone-50'
                          : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
                      }`}
                    >
                      Piel {skin.toLowerCase()}
                    </button>
                  );
                })}
              </div>

              <div className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-200">
                {recommendedForSkin.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-stone-100 shrink-0">
                        <ResilientImage
                          src={product.image}
                          alt={product.name}
                          fallbackLabel={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="text-sm font-medium text-stone-900 hover:underline underline-offset-4 text-left truncate block cursor-pointer"
                        >
                          {product.name}
                        </button>
                        <p className="text-xs text-stone-500 truncate">
                          {product.category} · ${product.price.toFixed(2)} USD
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToBag(product)}
                      className="px-3.5 py-2 text-xs font-medium border border-stone-300 text-stone-800 rounded-md hover:bg-stone-900 hover:text-stone-50 hover:border-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                    >
                      Agregar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="font-display text-xl font-medium text-stone-900">
              Aura Botánica
            </p>
            <p className="text-xs text-stone-500">
              Cuidado facial minimalista · © 2026 Todos los derechos reservados.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
            <a href="#catalogo" className="hover:text-stone-900 transition-colors">
              Catálogo
            </a>
            <a href="#rutina" className="hover:text-stone-900 transition-colors">
              Mi Rutina
            </a>
            <a href="#ingredientes" className="hover:text-stone-900 transition-colors">
              Ingredientes
            </a>
            <a href="#guia" className="hover:text-stone-900 transition-colors">
              Guía de piel
            </a>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToBag}
        onAddToRoutine={handleAddProductToRoutine}
        justAddedId={justAddedId}
      />

      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bagItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveBagItem}
        onClearBag={handleClearBag}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 px-4 py-3 bg-stone-900 text-stone-50 text-xs font-medium rounded-md shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
