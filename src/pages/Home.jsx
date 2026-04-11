import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaLeaf, FaRecycle } from 'react-icons/fa';
import { products } from '../data/productsData';
import ProductSidebar from '../components/ProductSidebar';

const categories = [
  "Teclados",
  "Cadeiras",
  "Mesas",
  "Mouses",
  "Fones (Headsets)",
  "Monitores",
  "Acessórios"
];

const EcoEducationPanel = () => (
  <section className="mb-10 bg-gray-50 border border-gray-100 rounded-xl p-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-happy-blue mb-1">
          Dica rapida
        </p>
        <h2 className="text-lg font-bold text-happy-text">Como comprar melhor sem complicar</h2>
      </div>
      <span className="inline-flex items-center gap-2 bg-white text-green-700 border border-green-100 rounded-lg px-3 py-2 text-xs font-bold">
        <FaLeaf /> Opcional
      </span>
    </div>

    <div className="grid md:grid-cols-3 gap-3 mt-4">
      {[
        'Confira se a embalagem e reciclavel.',
        'Compare itens similares antes de escolher.',
        'Descarte cabos e perifericos em pontos de e-lixo.'
      ].map((tip, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-lg p-3">
          <span className="text-happy-pink font-bold text-sm">Dica {index + 1}</span>
          <p className="text-sm text-gray-600 mt-1">{tip}</p>
        </div>
      ))}
    </div>
  </section>
);

const CategoryCarousel = ({ title, products, onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Rola aproximadamente o tamanho de um card + gap
      const scrollAmount = current.clientWidth / 2; 
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-10 group">
      {/* Título da Categoria */}
      <h3 className="text-xl font-bold text-happy-pink bg-gray-50 py-2 px-4 rounded-lg border-l-4 border-happy-pink mb-4 inline-block shadow-sm ml-2">
        {title}
      </h3>

      <div className="relative bg-[#fafafa] rounded-[25px] p-4 shadow-neon-blue border border-gray-100">
        
        {/* Botão Esquerdo */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-happy-pink text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-happy-pink-dark focus:outline-none hidden md:block"
        >
          <FaChevronLeft />
        </button>

        {/* Container Scrollável */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 pb-4 pt-2 no-scrollbar snap-x scroll-smooth"
        >
          {products.map((product) => (
            (() => {
              const sustainableAlternative = product.alternativaSustentavelId
                ? products.find((item) => item.id === product.alternativaSustentavelId)
                : null;

              return (
            <div 
              key={product.id} 
              className="flex-none w-[70%] sm:w-[40%] md:w-[30%] lg:w-[23%] bg-white border border-happy-detail rounded-[15px] p-4 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 flex flex-col snap-start"
            >
              <div className="min-h-7 flex justify-center mb-2">
                <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold border ${
                  product.sustentavel
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-cyan-50 text-happy-blue border-happy-detail'
                }`}>
                  {product.sustentavel ? <FaLeaf /> : <FaRecycle />}
                  {product.sustentavel ? 'Baixo impacto' : 'Embalagem reciclavel'}
                </span>
              </div>

              <img 
                src={product.image} 
                alt={product.nome} 
                className="w-[110px] h-[110px] object-contain mx-auto mb-4 rounded-md"
              />
              
              <div className="flex flex-col flex-grow text-center">
                <h5 className="text-sm font-bold text-gray-800 mb-2 h-10 flex items-center justify-center leading-tight line-clamp-2">
                  {product.nome}
                </h5>
                
                <div className="mt-auto w-full">
                  <p className="text-happy-pink font-bold text-base mb-3">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>

                  <p className="text-[11px] text-gray-500 min-h-8 mb-2 leading-snug">
                    {product.sustentavel
                      ? product.embalagem
                      : sustainableAlternative
                        ? `Opcao de menor impacto: ${sustainableAlternative.nome}`
                        : product.embalagem}
                  </p>
                  
                  <button 
                    onClick={() => onSelect(product)}
                    className="btn-primary w-full text-xs py-2 px-4 shadow-md"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>

        {/* Botão Direito */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-happy-pink text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-happy-pink-dark focus:outline-none hidden md:block"
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="relative min-h-screen">
      <main className="container mx-auto px-4 py-8 pb-20">
        {categories.map((category, index) => {
          const categoryProducts = products.filter(p => p.categoria === category);
          if (categoryProducts.length === 0) return null;

          return (
            <React.Fragment key={category}>
              <CategoryCarousel
                title={category}
                products={categoryProducts}
                onSelect={handleSelectProduct}
              />
              {index === 2 && <EcoEducationPanel />}
            </React.Fragment>
          );
        })}
      </main>

      <ProductSidebar 
        product={selectedProduct} 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
      />
    </div>
  );
};

export default Home;
