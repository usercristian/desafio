// Dados dos produtos extraídos do script.js original
// Adicionei uma barra "/" no início dos caminhos das imagens para garantir que carreguem de qualquer lugar

const sustainableProductIds = new Set([3, 5, 11, 15, 18, 22, 23, 27, 30, 35, 37, 39, 42]);

const sustainableProductByCategory = {
  'Teclados': 3,
  'Cadeiras': 11,
  'Mesas': 15,
  'Mouses': 22,
  'Fones (Headsets)': 27,
  'Monitores': 35,
  'Acessórios': 37
};

const esgByCategory = {
  'Teclados': {
    embalagem: 'Caixa de papelao reciclado com protecao interna reutilizavel',
    descarte: 'Separe cabos e componentes eletronicos e procure um ponto de coleta de e-lixo.',
    fornecedor: 'Fornecedor com declaracao simulada de reducao de plastico em embalagens.'
  },
  'Cadeiras': {
    embalagem: 'Papelao reciclavel e reducao de plastico bolha na protecao',
    descarte: 'Doe ou encaminhe partes metalicas e plasticas para cooperativas locais.',
    fornecedor: 'Fornecedor com politica simulada de ergonomia e aproveitamento de materiais.'
  },
  'Mesas': {
    embalagem: 'Papelao certificado e manual digital para reduzir impressos',
    descarte: 'Reutilize madeira ou envie ferragens para reciclagem quando o produto chegar ao fim da vida util.',
    fornecedor: 'Fornecedor com origem simulada de madeira controlada.'
  },
  'Mouses': {
    embalagem: 'Embalagem compacta 100% reciclavel',
    descarte: 'Nao descarte no lixo comum; use coleta de perifericos eletronicos.',
    fornecedor: 'Fornecedor com politica simulada de eficiencia energetica e reducao de plastico.'
  },
  'Fones (Headsets)': {
    embalagem: 'Papelao reciclavel com suporte interno sem isopor',
    descarte: 'Cabos, espumas e alto-falantes devem ir para descarte eletronico especializado.',
    fornecedor: 'Fornecedor com compromisso simulado de reparabilidade e pecas de reposicao.'
  },
  'Monitores': {
    embalagem: 'Caixa reciclavel com protecao reaproveitavel',
    descarte: 'Telas e placas devem ser destinadas a pontos certificados de e-lixo.',
    fornecedor: 'Fornecedor com politica simulada de eficiencia energetica.'
  },
  'Acessórios': {
    embalagem: 'Embalagem menor com papel reciclado',
    descarte: 'Priorize reuso; quando nao for possivel, descarte em coleta seletiva ou e-lixo.',
    fornecedor: 'Fornecedor com criterio simulado de reducao de residuos.'
  }
};

const getEsgData = (product) => {
  const profile = esgByCategory[product.categoria];
  const sustentavel = sustainableProductIds.has(product.id);
  const alternativeId = sustainableProductByCategory[product.categoria];

  return {
    impactoAmbiental: sustentavel ? 'baixo' : 'moderado',
    embalagem: sustentavel ? profile.embalagem : 'Embalagem reciclavel com materiais mistos',
    descarte: profile.descarte,
    fornecedor: profile.fornecedor,
    sustentavel,
    alternativaSustentavelId: sustentavel || alternativeId === product.id ? null : alternativeId
  };
};

const baseProducts = [
    // Teclados
    {
      id: 1,
      nome: 'Teclado Mecânico',
      categoria: 'Teclados',
      image: '/images/teclado.webp',
      keywords: ['teclado', 'teclados'],
      rating: 4.2,
      numRatings: 90,
      price: 466.07
    },
    {
      id: 2,
      nome: 'Teclado Gamer RGB',
      categoria: 'Teclados',
      image: '/images/Teclado.2.png',
      keywords: ['teclado', 'teclados'],
      rating: 4.8,
      numRatings: 250,
      price: 300.00
    },
    {
      id: 3,
      nome: 'Teclado Compacto',
      categoria: 'Teclados',
      image: '/images/Teclado.3.png',
      keywords: ['teclado', 'teclados'],
      rating: 4.0,
      numRatings: 30,
      price: 320.00
    },
    {
      id: 4,
      nome: 'Teclado Logi',
      categoria: 'Teclados',
      image: '/images/teclado4.webp',
      keywords: ['teclado', 'teclados'],
      rating: 4.1,
      numRatings: 15,
      price: 189.90
    },
    {
      id: 5,
      nome: 'Teclado Rosa',
      categoria: 'Teclados',
      image: '/images/teclado5.webp',
      keywords: ['teclado', 'teclados'],
      rating: 4.3,
      numRatings: 25,
      price: 189.90
    },
    {
      id: 6,
      nome: 'Teclado Branco',
      categoria: 'Teclados',
      image: '/images/teclado6.webp',
      keywords: ['teclado', 'teclados'],
      rating: 3.9,
      numRatings: 10,
      price: 299.90
    },
  
    // Cadeiras
    {
      id: 7,
      nome: 'Cadeira Gamer Rosa',
      categoria: 'Cadeiras',
      image: '/images/cadeira.jpg',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.6,
      numRatings: 310,
      price: 406.45
    },
    {
      id: 8,
      nome: 'Cadeira Fortrek',
      categoria: 'Cadeiras',
      image: '/images/Cadeira.2.png',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.3,
      numRatings: 120,
      price: 380.00
    },
    {
      id: 9,
      nome: 'Cadeira Preta',
      categoria: 'Cadeiras',
      image: '/images/Cadeira.3.png',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.1,
      numRatings: 75,
      price: 390.00
    },
    {
      id: 10,
      nome: 'Cadeira Ergo',
      categoria: 'Cadeiras',
      image: '/images/cadeira4.webp',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.0,
      numRatings: 30,
      price: 550.00
    },
    {
      id: 11,
      nome: 'Cadeira Office',
      categoria: 'Cadeiras',
      image: '/images/cadeira5.webp',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.2,
      numRatings: 12,
      price: 320.00
    },
    {
      id: 12,
      nome: 'Cadeira Azul',
      categoria: 'Cadeiras',
      image: '/images/cadeira6.webp',
      keywords: ['cadeira', 'cadeiras'],
      rating: 4.4,
      numRatings: 20,
      price: 480.00
    },
  
    // Mesas
    {
      id: 13,
      nome: 'Mesa Gamer com Prateleiras',
      categoria: 'Mesas',
      image: '/images/mesagamer.jpg',
      keywords: ['mesa', 'mesas'],
      rating: 4.5,
      numRatings: 110,
      price: 492.79
    },
    {
      id: 14,
      nome: 'Mesa em L',
      categoria: 'Mesas',
      image: '/images/Mesa.2.png',
      keywords: ['mesa', 'mesas'],
      rating: 4.0,
      numRatings: 45,
      price: 450.00
    },
    {
      id: 15,
      nome: 'Mesa de Madeira',
      categoria: 'Mesas',
      image: '/images/Mesa.3.png',
      keywords: ['mesa', 'mesas'],
      rating: 4.7,
      numRatings: 60,
      price: 460.00
    },
    {
      id: 16,
      nome: 'Mesa Gamer Z',
      categoria: 'Mesas',
      image: '/images/mesa4.webp',
      keywords: ['mesa', 'mesas'],
      rating: 4.5,
      numRatings: 18,
      price: 599.00
    },
    {
      id: 17,
      nome: 'Mesa Gamer L',
      categoria: 'Mesas',
      image: '/images/mesa5.webp',
      keywords: ['mesa', 'mesas'],
      rating: 4.1,
      numRatings: 22,
      price: 750.00
    },
    {
      id: 18,
      nome: 'Mesa Simples',
      categoria: 'Mesas',
      image: '/images/mesa6.webp',
      keywords: ['mesa', 'mesas'],
      rating: 3.8,
      numRatings: 40,
      price: 290.00
    },
  
    // Mouses
    {
      id: 19,
      nome: 'Mouse Ultra Light',
      categoria: 'Mouses',
      image: '/images/mouse.jpg',
      keywords: ['mouse', 'mouses'],
      rating: 4.4,
      numRatings: 450,
      price: 189.99
    },
    {
      id: 20,
      nome: 'Mouse Razer Edição',
      categoria: 'Mouses',
      image: '/images/mouserazer.webp',
      keywords: ['mouse', 'mouses'],
      rating: 4.9,
      numRatings: 320,
      price: 299.90
    },
    {
      id: 21,
      nome: 'Mouse Gamer Logitech',
      categoria: 'Mouses',
      image: '/images/Mouse.3 (2).png',
      keywords: ['mouse', 'mouses'],
      rating: 4.7,
      numRatings: 510,
      price: 249.90
    },
    {
      id: 22,
      nome: 'Mouse Ergo',
      categoria: 'Mouses',
      image: '/images/mouse4.webp',
      keywords: ['mouse', 'mouses'],
      rating: 4.6,
      numRatings: 35,
      price: 89.90
    },
    {
      id: 23,
      nome: 'Mouse Básico',
      categoria: 'Mouses',
      image: '/images/mouse5.webp',
      keywords: ['mouse', 'mouses'],
      rating: 4.3,
      numRatings: 28,
      price: 49.90
    },
    {
      id: 24,
      nome: 'Mouse Logi',
      categoria: 'Mouses',
      image: '/images/mouse6.webp',
      keywords: ['mouse', 'mouses'],
      rating: 4.0,
      numRatings: 15,
      price: 59.90
    },
  
    // Fones
    {
      id: 25,
      nome: 'Fone RGB 7.1',
      categoria: 'Fones (Headsets)',
      image: '/images/fone1.webp',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 4.3,
      numRatings: 180,
      price: 359.00
    },
    {
      id: 26,
      nome: 'Headset Havit',
      categoria: 'Fones (Headsets)',
      image: '/images/Fone.2.png',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 3.9,
      numRatings: 210,
      price: 199.90
    },
    {
      id: 27,
      nome: 'Headset JBL Quantum',
      categoria: 'Fones (Headsets)',
      image: '/images/Fone.3.png',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 4.6,
      numRatings: 290,
      price: 289.90
    },
    {
      id: 28,
      nome: 'Headset Branco',
      categoria: 'Fones (Headsets)',
      image: '/images/fone4.webp',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 3.9,
      numRatings: 45,
      price: 210.00
    },
    {
      id: 29,
      nome: 'Headset Logi',
      categoria: 'Fones (Headsets)',
      image: '/images/fone5.webp',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 4.1,
      numRatings: 33,
      price: 330.00
    },
    {
      id: 30,
      nome: 'Headset Rosa',
      categoria: 'Fones (Headsets)',
      image: '/images/fone6.webp',
      keywords: ['fone', 'fones', 'headset', 'headsets'],
      rating: 4.2,
      numRatings: 24,
      price: 210.00
    },
  
    // Monitores
    {
      id: 31,
      nome: 'Monitor 27" 144hz',
      categoria: 'Monitores',
      image: '/images/Monitor.png',
      keywords: ['monitor', 'monitores'],
      rating: 4.5,
      numRatings: 85,
      price: 1299.00
    },
    {
      id: 32,
      nome: 'Monitor LG UltraGear 24"',
      categoria: 'Monitores',
      image: '/images/Monitor.2.png',
      keywords: ['monitor', 'monitores'],
      rating: 4.8,
      numRatings: 190,
      price: 1459.00
    },
    {
      id: 33,
      nome: 'Monitor Alltek 21"',
      categoria: 'Monitores',
      image: '/images/Monitor.3.png',
      keywords: ['monitor', 'monitores'],
      rating: 3.8,
      numRatings: 50,
      price: 899.00
    },
    {
      id: 34,
      nome: 'Monitor Acer',
      categoria: 'Monitores',
      image: '/images/monitor4.webp',
      keywords: ['monitor', 'monitores'],
      rating: 4.1,
      numRatings: 17,
      price: 799.00
    },
    {
      id: 35,
      nome: 'Monitor AOC',
      categoria: 'Monitores',
      image: '/images/monitor5.webp',
      keywords: ['monitor', 'monitores'],
      rating: 4.4,
      numRatings: 29,
      price: 950.00
    },
    {
      id: 36,
      nome: 'Monitor Ultrawide',
      categoria: 'Monitores',
      image: '/images/monitor6.webp',
      keywords: ['monitor', 'monitores'],
      rating: 3.8,
      numRatings: 11,
      price: 2199.00
    },
  
    // Acessórios
    {
      id: 37,
      nome: 'Kit Mousepad Extenso',
      categoria: 'Acessórios',
      image: '/images/conjunto.webp',
      keywords: ['acessorio', 'acessorios', 'mousepad'],
      rating: 4.7,
      numRatings: 130,
      price: 99.90
    },
    {
      id: 38,
      nome: 'Suporte Monitor USB',
      categoria: 'Acessórios',
      image: '/images/suporte.jpg',
      keywords: ['acessorio', 'acessorios', 'suporte'],
      rating: 4.2,
      numRatings: 65,
      price: 159.00
    },
    {
      id: 39,
      nome: 'Mousepad Ergonômico',
      categoria: 'Acessórios',
      image: '/images/mousepad.jpg',
      keywords: ['acessorio', 'acessorios', 'mousepad'],
      rating: 3.5,
      numRatings: 25,
      price: 49.90
    },
    {
      id: 40,
      nome: 'Braço Mic',
      categoria: 'Acessórios',
      image: '/images/acessorios4.webp',
      keywords: ['acessorio', 'acessorios'],
      rating: 4.0,
      numRatings: 19,
      price: 120.00
    },
    {
      id: 41,
      nome: 'Mousepad RGB',
      categoria: 'Acessórios',
      image: '/images/acessorios5.webp',
      keywords: ['acessorio', 'acessorios'],
      rating: 4.3,
      numRatings: 27,
      price: 110.00
    },
    {
      id: 42,
      nome: 'Base Cooler',
      categoria: 'Acessórios',
      image: '/images/acessorios6.webp',
      keywords: ['acessorio', 'acessorios'],
      rating: 3.8,
      numRatings: 50,
      price: 85.00
    }
  ];

export const products = baseProducts.map((product) => ({
  ...product,
  ...getEsgData(product)
}));
