import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
      <h2 className="text-xl font-bold text-happy-pink bg-gray-50 py-2 px-4 rounded-lg border-l-4 border-happy-pink mb-4 inline-block shadow-sm ml-2">
        {title}
      </h2>

      <div className="relative bg-[#fafafa] rounded-[25px] p-4 shadow-neon-blue border border-gray-100">
        
        {/* Botão Esquerdo */}
        <button 
          onClick={() => scroll('left')}
          aria-label={`Rolar ${title} para a esquerda`}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-happy-pink text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-happy-pink-dark focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 hidden md:block"
        >
          <FaChevronLeft />
        </button>

        {/* Container Scrollável */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 pb-4 pt-2 no-scrollbar snap-x scroll-smooth"
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-none w-[70%] sm:w-[40%] md:w-[30%] lg:w-[23%] bg-white border border-happy-detail rounded-[15px] p-4 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 flex flex-col snap-start"
            >
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
                  
                  <button 
                    onClick={() => onSelect(product)}
                    className="btn-primary w-full text-xs py-2 px-4 shadow-md"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Direito */}
        <button 
          onClick={() => scroll('right')}
          aria-label={`Rolar ${title} para a direita`}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-happy-pink text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 hover:bg-happy-pink-dark focus-visible:ring-2 focus-visible:ring-happy-pink focus-visible:ring-offset-2 hidden md:block"
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
        <h1 className="sr-only">Happy Game — Loja de Produtos Gamer</h1>
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.categoria === category);
          if (categoryProducts.length === 0) return null;

          return (
            <CategoryCarousel 
              key={category} 
              title={category} 
              products={categoryProducts} 
              onSelect={handleSelectProduct} 
            />
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