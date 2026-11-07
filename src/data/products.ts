export type MachineModelType =
  | 'jaula-ganadera'
  | 'tolva'
  | 'pala-frontal'
  | 'rome-tijera'
  | 'volcador'
  | 'niveladora'
  | 'cisterna'
  | 'batea';

export type CustomizablePart = 'body' | 'details' | 'rims';

export interface CustomColors {
  body: string;
  details: string;
  rims: string;
}

export interface IndustrialColor {
  id: string;
  name: string;
  code: string;
  hex: string;
  category: 'kisser' | 'tractor' | 'chassis';
}

export interface ColorPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  body: string;
  details: string;
  rims: string;
}

export interface ProductVariantPreset {
  value: number;
  label: string;
}

export interface ProductVariantFilter {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  presets: ProductVariantPreset[];
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  subtitle: string;
  category: string;
  modelType: MachineModelType;
  capacity: string;
  dimensions: string;
  axlesOrConfig: string;
  description: string;
  instagramPhoto: string;
  instagramPostCaption: string;
  galleryPhotos: string[];
  instagramUrl: string;
  defaultColors: CustomColors;
  partLabels: {
    body: string;
    details: string;
    rims: string;
  };
  variantFilter: ProductVariantFilter;
  features: string[];
}

export interface SpecialDevelopmentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  photos: string[];
}

export const INDUSTRIAL_COLORS: IndustrialColor[] = [
  {
    id: 'verde-kisser',
    name: 'Verde Kisser',
    code: 'RAL 6002',
    hex: '#1B6B2F',
    category: 'kisser',
  },
  {
    id: 'verde-ingles',
    name: 'Verde Inglés T.20',
    code: 'RAL 6005',
    hex: '#194528',
    category: 'kisser',
  },
  {
    id: 'rojo-kisser',
    name: 'Rojo Carmesí Kisser',
    code: 'RAL 3020',
    hex: '#B81D24',
    category: 'kisser',
  },
  {
    id: 'amarillo-kisser',
    name: 'Amarillo Vial / Llanta',
    code: 'RAL 1023',
    hex: '#EAB308',
    category: 'kisser',
  },
  {
    id: 'azul-francia',
    name: 'Azul Francia Kisser',
    code: 'RAL 5015',
    hex: '#1E5AA8',
    category: 'kisser',
  },
  {
    id: 'naranja-agro',
    name: 'Naranja Hacienda',
    code: 'RAL 2008',
    hex: '#D9531E',
    category: 'kisser',
  },
  {
    id: 'gris-grafito',
    name: 'Gris Grafito / Pala',
    code: 'RAL 7021',
    hex: '#2B3036',
    category: 'kisser',
  },
  {
    id: 'aluminio-galv',
    name: 'Gris Perla Trailer',
    code: 'RAL 7035',
    hex: '#8C949E',
    category: 'tractor',
  },
  {
    id: 'blanco-guillotina',
    name: 'Blanco Franjas / Llanta',
    code: 'RAL 9010',
    hex: '#F4F4F0',
    category: 'chassis',
  },
  {
    id: 'negro-chasis',
    name: 'Negro Acero / Discos',
    code: 'RAL 9005',
    hex: '#181A1D',
    category: 'chassis',
  },
];

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'preset-verde-clasico',
    name: 'Verde Kisser + Amarillo',
    badge: 'Clásico de Fábrica',
    description: 'Carrocería verde esmeralda con gráfica blanca y llantas amarillas.',
    body: '#1B6B2F',
    details: '#F4F4F0',
    rims: '#EAB308',
  },
  {
    id: 'preset-tolva-t20',
    name: 'Verde Inglés T.20',
    badge: 'Línea Tolva 20T',
    description: 'Verde inglés oscuro con triple franja blanca y llantas gris acero.',
    body: '#194528',
    details: '#F4F4F0',
    rims: '#8C949E',
  },
  {
    id: 'preset-rojo-kisser',
    name: 'Rojo Carmesí + Blanco',
    badge: 'Línea Hacienda',
    description: 'Rojo carmesí brillante con líneas blancas y llantas rojas.',
    body: '#B81D24',
    details: '#F4F4F0',
    rims: '#B81D24',
  },
  {
    id: 'preset-amarillo-vial',
    name: 'Amarillo Vial Municipal',
    badge: 'Línea Vial / Comunas',
    description: 'Amarillo vial de alta visibilidad con contrapeso y detalles grafito.',
    body: '#EAB308',
    details: '#2B3036',
    rims: '#EAB308',
  },
  {
    id: 'preset-azul-francia',
    name: 'Azul Francia + Blanco',
    badge: 'Edición Especial',
    description: 'Azul Francia con doble filete blanco y llantas blancas.',
    body: '#1E5AA8',
    details: '#F4F4F0',
    rims: '#F4F4F0',
  },
  {
    id: 'preset-naranja-verde',
    name: 'Bicolor Naranja + Verde',
    badge: 'Combinado Campo',
    description: 'Naranja con detalles y bajo chasis en verde esmeralda.',
    body: '#D9531E',
    details: '#1B6B2F',
    rims: '#D9531E',
  },
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'tolva-t20',
    slug: 'tolva-autodescargable-t20',
    name: 'Tolva Autodescargable T.20 (20 Toneladas) y Semillera',
    shortTitle: 'Tolva',
    subtitle: '2 Ejes con Avantrén • Tubo Sinfín Plegable • 4 Cubiertas de Alta Flotación',
    category: 'Cosecha y Semillas',
    modelType: 'tolva',
    capacity: '20 Toneladas (Mod. T.20 / 20T.)',
    dimensions: 'Chasis 2 Ejes con Avantrén Giratorio',
    axlesOrConfig: '4 Neumáticos Alta Flotación con Taco Tractor',
    description:
      'Tolva autodescargable de 20 toneladas sobre chasis de 2 ejes con avantrén giratorio delantero, bandeja superior lisa con gráfica oficial T.20 y emblema ⚙ KISSER, cono inferior con 5 nervios estructurales inclinados, tubo sinfín delantero plegable hidráulicamente y arcos superiores para lona.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-47.jpg',
    instagramPostCaption:
      'Tolvas Autodescargables 20T. / T.20 en Verde Kisser y Verde Inglés, más Tolva Semillera de doble sinfín fabricadas en Hasenkamp.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-47.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-56_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-33-01_1.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#1B6B2F',
      details: '#EAB308',
      rims: '#EAB308',
    },
    partLabels: {
      body: 'Cuerpo de Tolva, Sinfín y Chasis',
      details: 'Gráfica T.20, Triple Franja y Logo ⚙ KISSER',
      rims: 'Llantas Agrícolas de Alta Flotación',
    },
    variantFilter: {
      label: 'Capacidad de Tolva (Toneladas)',
      unit: 'Ton.',
      min: 6,
      max: 30,
      step: 2,
      defaultValue: 20,
      presets: [
        { value: 6, label: '6 Ton. (T.6)' },
        { value: 10, label: '10 Ton. (T.10)' },
        { value: 14, label: '14 Ton. (T.14)' },
        { value: 20, label: '20 Ton. (T.20)' },
        { value: 24, label: '24 Ton. (T.24)' },
        { value: 30, label: '30 Ton. (T.30)' },
      ],
    },
    features: [
      'Bandeja superior lisa con inscripción T.20 adelante, triple franja curva al centro y ⚙ KISSER atrás',
      'Cono inferior plegado con 5 costillas inclinadas de refuerzo por lateral (sin invadir la faja superior)',
      'Tubo sinfín delantero izquierdo que sube en diagonal y se pliega horizontalmente sobre el frente superior',
      'Chasis de 2 ejes con logo ⚙ KISSER lateral, avantrén delantero y lanza en V con INDUSTRIA ARGENTINA',
    ],
  },
  {
    id: 'acoplado-jaula-ganadero',
    slug: 'acoplado-jaula-ganadera',
    name: 'Carruaje / Acoplado Jaula Ganadera Tándem',
    shortTitle: 'Jaula Ganadera',
    subtitle: 'Doble Eje Balancín • Puerta Guillotina • Versión Arrastre, Camión o Cuello de Cisne',
    category: 'Línea Hacienda',
    modelType: 'jaula-ganadera',
    capacity: '6 a 10 Cabezas (Arrastre / Cuello de Cisne / Camión)',
    dimensions: '4.00 m a 6.00 m × 2.00 m',
    axlesOrConfig: 'Doble Eje Tándem Balancín (4 Ruedas)',
    description:
      'Carruaje jaula ganadera con arcos superiores chanfleados a 45°, faja central con doble línea pintada interrumpida en el paño central para el emblema ⚙ KISSER, puerta trasera guillotina con roldanas superiores y guardabarros tándem con punteras en diagonal.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-38_1.jpg',
    instagramPostCaption:
      'Acoplados jaula ganadera entregados en Verde Kisser, Rojo Carmesí, Azul Francia, Naranja/Verde y Trailer Cuello de Cisne para pick-up.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-38_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-37_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-33-01.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-56_2.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-51_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-36.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-49.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#1B6B2F',
      details: '#F4F4F0',
      rims: '#EAB308',
    },
    partLabels: {
      body: 'Barandas, Parantes, Guardabarros y Lanza',
      details: 'Emblema ⚙ KISSER y Gráfica Institucional',
      rims: 'Llantas del Tándem Balancín (4 Ruedas)',
    },
    variantFilter: {
      label: 'Capacidad de Hacienda (Cabezas)',
      unit: 'Cabezas',
      min: 4,
      max: 12,
      step: 1,
      defaultValue: 8,
      presets: [
        { value: 4, label: '4 Cabezas (3.5m)' },
        { value: 6, label: '6 Cabezas (4.0m)' },
        { value: 8, label: '8 Cabezas (4.8m)' },
        { value: 10, label: '10 Cabezas (5.5m)' },
        { value: 12, label: '12 Cabezas (6.0m)' },
      ],
    },
    features: [
      'Laterales de chapa plegada con ranuras reales de ventilación, 4 caños superiores y emblema ⚙ KISSER',
      '9 parantes por banda con ochavas superiores a 45° hacia adentro y pórtico trasero blanco con puerta guillotina',
      'Pecho delantero con escarapela argentina, rueda de auxilio y lanza en V con tensor regulable',
      'Disponible en Verde Kisser, Rojo Carmesí, Azul Francia, Bicolor Naranja/Verde y Gris Perla',
    ],
  },
  {
    id: 'pala-cargadora-frontal',
    slug: 'pala-cargadora-frontal',
    name: 'Pala Cargadora Frontal Hidráulica con Paralelogramo',
    shortTitle: 'Pala Cargadora Frontal',
    subtitle: 'Brazos Quebrados con Paralelogramo • Balde en Cuña Diagonal • Patas de Apoyo',
    category: 'Movimiento y Carga',
    modelType: 'pala-frontal',
    capacity: '1.200 a 1.800 kg de Carga Operativa',
    dimensions: 'Balde Trapezoidal 1.80 m a 2.10 m',
    axlesOrConfig: '4 Cilindros Doble Efecto + Autonivelación',
    description:
      'Pala cargadora frontal hidráulica con brazos quebrados en diagonal de una sola pieza, sistema paralelogramo mecánico superior, patas de apoyo verticales desmontables, travesaño cilíndrico delantero y balde trapezoidal en cuña diagonal pintado en color combinable.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-47_1.jpg',
    instagramPostCaption:
      'Las 3 terminaciones insignia frente a planta (Roja, Grafito y Verde) e instalaciones sobre tractores Lovol, Massey Ferguson, John Deere, Hanomag y Roland H.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-47_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-40.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-54_2.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-58_2.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-45_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-43_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-46.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#B81D24',
      details: '#2B3036',
      rims: '#8C949E',
    },
    partLabels: {
      body: 'Brazos de Levante, Paralelogramo y Columnas',
      details: 'Balde Trapezoidal en Cuña Diagonal',
      rims: 'Costillas de Refuerzo del Balde',
    },
    variantFilter: {
      label: 'Capacidad y Ancho de Balde (kg)',
      unit: 'kg',
      min: 1000,
      max: 2200,
      step: 200,
      defaultValue: 1600,
      presets: [
        { value: 1000, label: '1.000 kg (Balde 1.5m)' },
        { value: 1200, label: '1.200 kg (Balde 1.7m)' },
        { value: 1600, label: '1.600 kg (Balde 2.0m)' },
        { value: 1800, label: '1.800 kg (Balde 2.2m)' },
        { value: 2200, label: '2.200 kg (Balde 2.4m)' },
      ],
    },
    features: [
      'Balde trapezoidal en cuña diagonal personalizable en Gris Grafito, Rojo Carmesí o Verde Kisser',
      'Emblema ⚙ KISSER en el tramo superior e INDUSTRIA ARGENTINA en el brazo diagonal delantero',
      'Sistema paralelogramo superior, buje circular pasante en el codo y patas de apoyo verticales',
      'Travesaño frontal tubular redondo de alta rigidez torsional',
    ],
  },
  {
    id: 'rastra-rome-tijera-18',
    slug: 'rastra-rome-tijera',
    name: 'Rastra de Tiro Excéntrico Rome Tijera (18 a 28 Platos)',
    shortTitle: 'Rastra Rome Tijera',
    subtitle: '18 Discos Dentados • Soportes en Diagonal • Levante Hidráulico Central',
    category: 'Labranza Pesada',
    modelType: 'rome-tijera',
    capacity: '18 a 28 Discos Dentados de 26"',
    dimensions: 'Ancho de Labor 2.30 m a 3.40 m',
    axlesOrConfig: 'Articulación Tijera + Cilindro Hidráulico Central',
    description:
      'Rastra desencontrada de tiro excéntrico tipo Rome Tijera con chasis tubular pesado, 18 discos cóncavos dentados de 26" en acero al boro, bisagra lateral articulada, cilindro hidráulico de apertura y lanza central con boquilla de enganche al tractor.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-43.jpg',
    instagramPostCaption:
      'Rastra Rome Tijera de 18 platos entregada en planta de Hasenkamp lista para trabajar en el lote.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-43.jpg',
      '/instagram/post-6-slide-1.jpg',
      '/instagram/post-6-slide-2.jpg',
      '/instagram/post-6-slide-3.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#1B6B2F',
      details: '#F4F4F0',
      rims: '#EAB308',
    },
    partLabels: {
      body: 'Chasis Tubular, Lanza y Limpiadiscos',
      details: 'Calcos ⚙ KISSER e INDUSTRIA ARGENTINA',
      rims: 'Carreteles Separadores y Bancadas',
    },
    variantFilter: {
      label: 'Cantidad de Discos Dentados (Platos)',
      unit: 'Discos',
      min: 14,
      max: 28,
      step: 2,
      defaultValue: 18,
      presets: [
        { value: 14, label: '14 Discos (7+7)' },
        { value: 16, label: '16 Discos (8+8)' },
        { value: 18, label: '18 Discos (9+9)' },
        { value: 20, label: '20 Discos (10+10)' },
        { value: 24, label: '24 Discos (12+12)' },
        { value: 28, label: '28 Discos (14+14)' },
      ],
    },
    features: [
      'Chasis tubular con emblema ⚙ KISSER lateral e INDUSTRIA ARGENTINA adherido al larguero de la lanza',
      'Soportes de bancadas soldados en diagonal con cartelas de refuerzo',
      'Discos dentados cóncavos de 26 pulgadas con limpiadores regulables',
      'Rulo alto circular porta-mangueras hidráulicas y registro telescópico de nivelación',
    ],
  },
  {
    id: 'acoplado-volcador-kisser',
    slug: 'acoplado-volcador-hidraulico',
    name: 'Acoplado Volcador Hidráulico (Trasero y Bilateral)',
    shortTitle: 'Acoplado Volcador',
    subtitle: '2 Ejes con Avantrén • Cilindro Telescópico Central • Barandas Rebatibles',
    category: 'Vial y Transporte',
    modelType: 'volcador',
    capacity: '6 a 10 Toneladas de Carga Vial / Agrícola',
    dimensions: 'Chasis Reforzado de 2 Ejes con Avantrén',
    axlesOrConfig: 'Cilindro Hidráulico Telescópico de 3 Etapas',
    description:
      'Acoplado volcador hidráulico de 2 ejes con cilindro telescópico central de 3 etapas, barandas laterales rebatibles con costillas verticales de refuerzo, avantrén giratorio delantero y chasis de perfil pesado para uso agropecuario y municipal.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-48.jpg',
    instagramPostCaption:
      'Acoplados volcadores hidráulicos fabricados en Verde Kisser y Amarillo Vial para productores, Comuna de Colonia Crespo y Junta de Gobierno de Arroyo Burgos.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-48.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-49_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-51.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-53_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-59.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-59_2.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#EAB308',
      details: '#2B3036',
      rims: '#EAB308',
    },
    partLabels: {
      body: 'Caja Volcadora, Chasis y Lanza',
      details: 'Emblema ⚙ KISSER y Gráfica Institucional',
      rims: 'Llantas de los 2 Ejes (4 Ruedas)',
    },
    variantFilter: {
      label: 'Capacidad de Carga Volcadora (Toneladas)',
      unit: 'Ton.',
      min: 4,
      max: 14,
      step: 2,
      defaultValue: 8,
      presets: [
        { value: 4, label: '4 Toneladas' },
        { value: 6, label: '6 Toneladas' },
        { value: 8, label: '8 Toneladas' },
        { value: 10, label: '10 Toneladas' },
        { value: 12, label: '12 Toneladas' },
        { value: 14, label: '14 Toneladas' },
      ],
    },
    features: [
      'Caja reforzada con teleras inferiores cercanas para transporte de áridos, tierra o grano',
      'Barandas abatibles con cierre rápido y emblema ⚙ KISSER limpio en el paño lateral derecho',
      'Cilindro telescópico central de gran ángulo de descarga',
      'Lanza articulada con ojal giratorio y calco INDUSTRIA ARGENTINA',
    ],
  },
  {
    id: 'niveladora-arrastre-kisser',
    slug: 'pala-niveladora-de-arrastre',
    name: 'Pala Niveladora de Arrastre Hidráulica con Contrapeso',
    shortTitle: 'Niveladora de Arrastre',
    subtitle: 'Viga Cuello de Cisne • Hoja Regulable en Ángulo e Inclinación • Contrapeso Trasero',
    category: 'Vial y Sistematización',
    modelType: 'niveladora',
    capacity: 'Hoja Curva de 3.00 m con Cuchilla Cambiable',
    dimensions: 'Viga Central Cuello de Cisne de Gran Despeje',
    axlesOrConfig: '2 Ruedas Traseras con Taco Tractor + Cajón de Lastre',
    description:
      'Pala niveladora de arrastre con chasis cuello de cisne de gran despeje, hoja curva regulable hidráulicamente en altura, cruce e inclinación, cajón de contrapeso trasero en gris grafito y 2 neumáticos agrícolas traseros con taco tractor.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-32-38_2.jpg',
    instagramPostCaption:
      'Pala Niveladora de Arrastre Kisser en Amarillo Vial con cajón de contrapeso gris grafito para conservación de caminos y sistematización de lotes.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-32-38_2.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-38.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-39.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#EAB308',
      details: '#2B3036',
      rims: '#EAB308',
    },
    partLabels: {
      body: 'Viga Cuello de Cisne y Hoja Niveladora',
      details: 'Cajón de Contrapeso Trasero',
      rims: 'Llantas Traseras de Alta Tracción',
    },
    variantFilter: {
      label: 'Ancho de Hoja Niveladora (cm)',
      unit: 'cm',
      min: 240,
      max: 420,
      step: 30,
      defaultValue: 300,
      presets: [
        { value: 240, label: '2.40 m (240 cm)' },
        { value: 270, label: '2.70 m (270 cm)' },
        { value: 300, label: '3.00 m (300 cm)' },
        { value: 360, label: '3.60 m (360 cm)' },
        { value: 420, label: '4.20 m (420 cm)' },
      ],
    },
    features: [
      'Viga central elevada con emblemas ⚙ KISSER e INDUSTRIA ARGENTINA sobre los laterales',
      'Cajón de contrapeso trasero sobre el eje para máxima penetración en suelos compactados',
      'Cuchilla frontal reversible de acero al boro resistente al desgaste',
      'Pie de apoyo delantero vertical regulable y circuito hidráulico completo',
    ],
  },
  {
    id: 'tanque-cisterna-kisser',
    slug: 'acoplado-tanque-cisterna-regador',
    name: 'Acoplado Tanque Cisterna / Regador Municipal y Combustible',
    shortTitle: 'Tanque Cisterna',
    subtitle: 'Agua o Combustible (3.500 a 8.000 Lts.) • Rompeolas Internos • Baulera Delantera',
    category: 'Abastecimiento y Comunas',
    modelType: 'cisterna',
    capacity: '3.500 a 8.000 Litros con Rompeolas',
    dimensions: 'Chasis 2 Ejes con Bandejas Laterales',
    axlesOrConfig: 'Baulera Delantera / Motobomba / Flor de Riego',
    description:
      'Acoplado tanque cisterna metálico con rompeolas interiores, boca pasa-hombre superior, bandejas laterales porta-mangueras, plataforma delantera para motobomba o surtidor con baulera y chasis de 2 ejes con avantrén giratorio.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-33-00_1.jpg',
    instagramPostCaption:
      'Cisterna de Combustible 3500 Lts. bicolor y Tanques Regadores entregados a Municipalidad de Tabossi y Comuna de Arroyo Burgos.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-33-00_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-54_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-54_3.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-59_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-50.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#1B6B2F',
      details: '#2B3036',
      rims: '#2B3036',
    },
    partLabels: {
      body: 'Tanque Cisterna, Chasis y Pasarelas',
      details: 'Baulera Delantera, Franjas y Logo ⚙ KISSER',
      rims: 'Llantas de los 2 Ejes (4 Ruedas)',
    },
    variantFilter: {
      label: 'Capacidad del Tanque (Litros)',
      unit: 'Lts.',
      min: 1500,
      max: 10000,
      step: 500,
      defaultValue: 5000,
      presets: [
        { value: 1500, label: '1.500 Lts.' },
        { value: 3500, label: '3.500 Lts.' },
        { value: 5000, label: '5.000 Lts.' },
        { value: 6500, label: '6.500 Lts.' },
        { value: 8000, label: '8.000 Lts.' },
        { value: 10000, label: '10.000 Lts.' },
      ],
    },
    features: [
      'Disponible en versión Cisterna de Combustible con baulera cerrada o Tanque Regador Comunal',
      'Bandejas laterales corridas y boca pasa-hombre superior con tapa abulonada',
      'Gráfica lateral personalizada con doble franja y emblema ⚙ KISSER',
      'Tren delantero giratorio de gran radio de maniobra con lanza articulada',
    ],
  },
  {
    id: 'batea-trailer-kisser',
    slug: 'trailer-batea-con-rampas',
    name: 'Trailer / Batea Playa Tándem con Rampas Traseras',
    shortTitle: 'Batea con Rampas',
    subtitle: 'Baja Altura de Carga • 2 Rampas Traseras Rebatibles • Doble Eje Balancín',
    category: 'Transporte de Maquinaria',
    modelType: 'batea',
    capacity: '4 a 8 Toneladas para Maquinaria y Equipos',
    dimensions: 'Plataforma Baja con Cola Inclinada',
    axlesOrConfig: 'Tándem Balancín (4 Ruedas) + 2 Rampas Rebatibles',
    description:
      'Batea playa de baja altura con sistema tándem balancín, cola inclinada, 2 rampas traseras rebatibles con escalones antideslizantes, pecho delantero de contención y placa lateral con emblema ⚙ KISSER.',
    instagramPhoto: '/muestras/PHOTO-2026-11-06-22-33-00_3.jpg',
    instagramPostCaption:
      'Trailers y bateas playas con rampas traseras en Azul Francia, Verde Kisser y Rojo Carmesí para traslado de maquinaria.',
    galleryPhotos: [
      '/muestras/PHOTO-2026-11-06-22-33-00_3.jpg',
      '/muestras/PHOTO-2026-11-06-22-33-00.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-46_1.jpg',
    ],
    instagramUrl: 'https://www.instagram.com/industriaskisser/',
    defaultColors: {
      body: '#1E5AA8',
      details: '#F4F4F0',
      rims: '#F4F4F0',
    },
    partLabels: {
      body: 'Plataforma, Guardabarros y Chasis',
      details: 'Rampas Traseras, Pie de Apoyo y Logo ⚙ KISSER',
      rims: 'Llantas del Tándem (4 Ruedas)',
    },
    variantFilter: {
      label: 'Capacidad y Largo de Batea (Toneladas)',
      unit: 'Ton.',
      min: 4,
      max: 12,
      step: 2,
      defaultValue: 6,
      presets: [
        { value: 4, label: '4 Ton. (4.0m)' },
        { value: 6, label: '6 Ton. (4.8m)' },
        { value: 8, label: '8 Ton. (5.4m)' },
        { value: 10, label: '10 Ton. (6.0m)' },
        { value: 12, label: '12 Ton. (6.5m)' },
      ],
    },
    features: [
      '2 rampas traseras articuladas pintadas en color de contraste para máxima visibilidad',
      'Placa lateral adelantada al guardabarros con emblema ⚙ KISSER y filete perimetral',
      'Lanza en V reforzada con pie de apoyo telescópico y calco INDUSTRIA ARGENTINA',
      'Ideal para transporte de minicargadoras, tractores compactos, autoelevadores y rollos',
    ],
  },
];

export const SPECIAL_DEVELOPMENTS: SpecialDevelopmentItem[] = [
  {
    id: 'transportador-rollos',
    title: 'Transportadores Hidráulicos de Rollos',
    category: 'Forraje y Pasturas',
    description:
      'Acoplados transportadores de rollos en fila con cunas abatibles hidráulicamente y lanza desplazable, fabricados en Naranja y Amarillo Vial.',
    photos: [
      '/muestras/PHOTO-2026-11-06-22-32-42.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-59_3.jpg',
    ],
  },
  {
    id: 'desmalezadoras-kisser',
    title: 'Desmalezadoras de 3 Puntos, de Arrastre e Hileradoras',
    category: 'Mantenimiento de Lotes y Banquinas',
    description:
      'Desmalezadoras reforzadas con cortina delantera de cadenas protectoras, caja en baño de aceite y versiones de 3 puntos, arrastre o doble rotor.',
    photos: [
      '/muestras/PHOTO-2026-11-06-22-32-56.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-58.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-58_3.jpg',
    ],
  },
  {
    id: 'casilla-aleros-kisser',
    title: 'Módulo / Casilla Rural con Aleros Laterales Rebatibles',
    category: 'Infraestructura de Campo',
    description:
      'Estructura metálica sobre chasis de 1 eje revestida en chapa sinusoidal galvanizada con amplios portones laterales rebatibles que forman aleros de sombra.',
    photos: [
      '/muestras/PHOTO-2026-11-06-22-32-53.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-54.jpg',
    ],
  },
  {
    id: 'topadoras-desmonte-kisser',
    title: 'Topadoras Frontales, Rastrillos de Desmonte y Desarrollos Especiales',
    category: 'Desmonte y Metalúrgica Pesada',
    description:
      'Pala topadora frontal gris, rastrillo de desmonte para pala cargadora vial SEM, horquillas frontales y fabricación de tanques industriales con hidrogrúa propia.',
    photos: [
      '/muestras/PHOTO-2026-11-06-22-33-00_2.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-37.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-45.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-58_1.jpg',
      '/muestras/PHOTO-2026-11-06-22-32-40_1.jpg',
    ],
  },
];

export const COMPANY_INFO = {
  company: 'Industrias Kisser',
  legalSubtitle: 'Fábrica de Maquinarias Agrícolas',
  foundersStory:
    'Fundada por Don Carlos Kisser en Hasenkamp, Entre Ríos, y continuada hoy por sus hijos Norby y Freddy Kisser junto a todo el equipo metalúrgico de planta.',
  location: 'Hasenkamp, Entre Ríos, Argentina',
  phoneDisplay: '0343 493-0083 / 15-4158502',
  whatsappDisplay: '0343 15-4158502',
  whatsappNumber: '5493434158502',
  instagramHandle: '@industriaskisser',
  instagramUrl: 'https://www.instagram.com/industriaskisser/',
};
