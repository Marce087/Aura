export type ProductCategory = 'Todos' | 'Limpieza' | 'Sérums' | 'Hidratación' | 'Protección';
export type SkinType = 'Todo tipo' | 'Seca' | 'Mixta' | 'Sensible';
export type RoutinePeriod = 'AM' | 'PM';

export interface BeautyProduct {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'Todos'>;
  volume: string;
  price: number;
  shortBenefit: string;
  description: string;
  ingredients: string[];
  skinTypes: SkinType[];
  recommendedPeriod: RoutinePeriod | 'AM/PM';
  image: string;
  availability: string;
}

export interface RoutineStep {
  id: string;
  period: RoutinePeriod;
  order: number;
  title: string;
  productName: string;
  productId?: string;
  note: string;
  completed: boolean;
}

export interface IngredientNote {
  name: string;
  origin: string;
  benefit: string;
  concentration: string;
}

export const HERO_IMAGE = '/src/assets/images/hero_beauty_ritual_1794619621117.jpg';

export const BEAUTY_PRODUCTS: BeautyProduct[] = [
  {
    id: 'gel-limpiador-puro',
    name: 'Gel Limpiador Hidratante',
    category: 'Limpieza',
    volume: '200 ml',
    price: 28,
    shortBenefit: 'Limpia con suavidad sin alterar la barrera natural.',
    description:
      'Fórmula sin sulfatos con avena coloidal y glicerina vegetal que disuelve impurezas diarias dejando la piel calma, elástica y sin tirantez.',
    ingredients: ['Avena coloidal', 'Glicerina vegetal', 'Pantenol B5'],
    skinTypes: ['Todo tipo', 'Sensible', 'Seca'],
    recommendedPeriod: 'AM/PM',
    image: '/src/assets/images/product_cleanser_gel_1794619622336.jpg',
    availability: 'Disponible',
  },
  {
    id: 'bruma-tonica-botanica',
    name: 'Bruma Tónica Botánica',
    category: 'Limpieza',
    volume: '100 ml',
    price: 24,
    shortBenefit: 'Equilibra el pH y prepara la piel para absorber activos.',
    description:
      'Rocío microfino con hidrolato de azahar, niacinamida al 2% y extracto de eucalipto blanco para refrescar e hidratar al instante.',
    ingredients: ['Agua de azahar', 'Niacinamida 2%', 'Ácido hialurónico'],
    skinTypes: ['Todo tipo', 'Mixta', 'Sensible'],
    recommendedPeriod: 'AM/PM',
    image: '/src/assets/images/product_mist_toner_1794619624207.jpg',
    availability: 'Disponible',
  },
  {
    id: 'serum-lumina-c',
    name: 'Sérum Lumina Vitamina C',
    category: 'Sérums',
    volume: '30 ml',
    price: 42,
    shortBenefit: 'Aporta luminosidad uniforme y defensa antioxidante.',
    description:
      'Concentrado en frasco ámbar con vitamina C estabilizada al 10%, aceite de jojoba y rosa mosqueta prensada en frío para revitalizar el tono.',
    ingredients: ['Vitamina C 10%', 'Rosa mosqueta', 'Escualano de oliva'],
    skinTypes: ['Todo tipo', 'Seca', 'Mixta'],
    recommendedPeriod: 'AM',
    image: '/src/assets/images/product_serum_drops_1794619622284.jpg',
    availability: 'Disponible',
  },
  {
    id: 'crema-barrera-ceramica',
    name: 'Crema Barrera Cerámica',
    category: 'Hidratación',
    volume: '50 ml',
    price: 38,
    shortBenefit: 'Sella la humedad durante 24 horas con textura sedosa.',
    description:
      'Emulsión rica en ceramidas bioidénticas, manteca de karité refinada y centella asiática para reparar pieles expuestas al viento o resequedad.',
    ingredients: ['Ceramidas NP/AP', 'Centella asiática', 'Manteca de karité'],
    skinTypes: ['Seca', 'Sensible', 'Todo tipo'],
    recommendedPeriod: 'PM',
    image: '/src/assets/images/product_cream_jar_1794619623916.jpg',
    availability: 'Disponible',
  },
  {
    id: 'protector-mineral-fps50',
    name: 'Protector Mineral FPS 50+',
    category: 'Protección',
    volume: '100 ml',
    price: 32,
    shortBenefit: 'Protección UVA/UVB invisible sin residuo blanco.',
    description:
      'Filtro mineral ligero de óxido de zinc no-nano con acabado natural semimate. Diseñado para usarse todos los días bajo maquillaje o solo.',
    ingredients: ['Óxido de zinc 18%', 'Bisabolol', 'Vitamina E'],
    skinTypes: ['Todo tipo', 'Sensible', 'Mixta'],
    recommendedPeriod: 'AM',
    image: '/src/assets/images/product_sunscreen_fluid_1794619624227.jpg',
    availability: 'Disponible',
  },
  {
    id: 'aceite-labial-rosas',
    name: 'Aceite Labial Infusión Rosa',
    category: 'Hidratación',
    volume: '30 ml',
    price: 22,
    shortBenefit: 'Nutre labios con brillo translúcido y pétalos reales.',
    description:
      'Elixir emoliente no pegajoso con infusión de pétalos de rosa damascena, aceite de almendra dulce y péptidos suavizantes.',
    ingredients: ['Rosa damascena', 'Aceite de jojoba', 'Péptidos vegetales'],
    skinTypes: ['Todo tipo', 'Seca', 'Sensible'],
    recommendedPeriod: 'AM/PM',
    image: '/src/assets/images/product_lip_oil_1794619622796.jpg',
    availability: 'Edición limitada',
  },
];

export const DEFAULT_ROUTINE_STEPS: RoutineStep[] = [
  {
    id: 'am-1',
    period: 'AM',
    order: 1,
    title: 'Limpieza suave',
    productName: 'Gel Limpiador Hidratante',
    productId: 'gel-limpiador-puro',
    note: 'Masajear 30 segundos con agua tibia.',
    completed: false,
  },
  {
    id: 'am-2',
    period: 'AM',
    order: 2,
    title: 'Preparación hidratante',
    productName: 'Bruma Tónica Botánica',
    productId: 'bruma-tonica-botanica',
    note: 'Aplicar 3 pulverizaciones sobre piel húmeda.',
    completed: false,
  },
  {
    id: 'am-3',
    period: 'AM',
    order: 3,
    title: 'Tratamiento antioxidante',
    productName: 'Sérum Lumina Vitamina C',
    productId: 'serum-lumina-c',
    note: '3 gotas en rostro y cuello antes de hidratar.',
    completed: false,
  },
  {
    id: 'am-4',
    period: 'AM',
    order: 4,
    title: 'Protección solar diaria',
    productName: 'Protector Mineral FPS 50+',
    productId: 'protector-mineral-fps50',
    note: 'Dos líneas de dedo 15 minutos antes de salir.',
    completed: false,
  },
  {
    id: 'pm-1',
    period: 'PM',
    order: 1,
    title: 'Limpieza nocturna',
    productName: 'Gel Limpiador Hidratante',
    productId: 'gel-limpiador-puro',
    note: 'Retirar protector solar e impurezas del día.',
    completed: false,
  },
  {
    id: 'pm-2',
    period: 'PM',
    order: 2,
    title: 'Calma y equilibrio',
    productName: 'Bruma Tónica Botánica',
    productId: 'bruma-tonica-botanica',
    note: 'Presionar suavemente con las palmas limpias.',
    completed: false,
  },
  {
    id: 'pm-3',
    period: 'PM',
    order: 3,
    title: 'Reparación de barrera',
    productName: 'Crema Barrera Cerámica',
    productId: 'crema-barrera-ceramica',
    note: 'Sellar la hidratación con masaje ascendente.',
    completed: false,
  },
  {
    id: 'pm-4',
    period: 'PM',
    order: 4,
    title: 'Bálsamo nutritivo',
    productName: 'Aceite Labial Infusión Rosa',
    productId: 'aceite-labial-rosas',
    note: 'Capa generosa nocturna en labios y comisuras.',
    completed: false,
  },
];

export const INGREDIENT_GLOSSARY: IngredientNote[] = [
  {
    name: 'Niacinamida',
    origin: 'Vitamina B3 pura',
    benefit: 'Minimiza la apariencia de poros y fortalece la barrera lipídica.',
    concentration: '2% – 5%',
  },
  {
    name: 'Ceramidas Bioidénticas',
    origin: 'Fermentación vegetal',
    benefit: 'Rellenan los espacios intercelulares para evitar pérdida de agua.',
    concentration: 'Complejo 3%',
  },
  {
    name: 'Vitamina C Estabilizada',
    origin: 'Ascorbil glucósido',
    benefit: 'Ilumina manchas leves y neutraliza radicales libres sin irritar.',
    concentration: '10%',
  },
  {
    name: 'Avena Coloidal',
    origin: 'Grano molido fino',
    benefit: 'Calma rojeces al instante y aporta beta-glucanos suavizantes.',
    concentration: '1.5%',
  },
];
