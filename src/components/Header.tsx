interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
}

export function Header({ bagCount, onOpenBag }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
        <a
          href="#inicio"
          className="font-display text-2xl font-medium tracking-tight text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 rounded-sm"
        >
          Aura Botánica
        </a>

        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
        >
          <a
            href="#catalogo"
            className="hover:text-stone-900 hover:underline underline-offset-4 decoration-stone-400 transition-colors whitespace-nowrap shrink-0"
          >
            Catálogo
          </a>
          <a
            href="#rutina"
            className="hover:text-stone-900 hover:underline underline-offset-4 decoration-stone-400 transition-colors whitespace-nowrap shrink-0"
          >
            Mi Rutina
          </a>
          <a
            href="#ingredientes"
            className="hover:text-stone-900 hover:underline underline-offset-4 decoration-stone-400 transition-colors whitespace-nowrap shrink-0"
          >
            Ingredientes
          </a>
          <a
            href="#guia"
            className="hover:text-stone-900 hover:underline underline-offset-4 decoration-stone-400 transition-colors whitespace-nowrap shrink-0"
          >
            Guía
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`Abrir bolsa de compras con ${bagCount} artículos`}
            className="px-4 py-2 text-xs font-medium text-stone-50 bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 tabular-nums min-h-[40px]"
          >
            {bagCount > 0 ? `Bolsa (${bagCount})` : 'Mi Bolsa'}
          </button>
        </div>
      </div>
    </header>
  );
}
