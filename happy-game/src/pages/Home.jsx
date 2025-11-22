import React, { useState } from 'react';
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
    <div className="relative">
      <main className="container mx-auto px-4 py-8 pb-20">
        
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.categoria === category);
          
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category} className="mb-10">
              <h3 className="text-xl font-bold text-happy-pink bg-gray-50 py-2 px-4 rounded-lg border-l-4 border-happy-pink mb-4 inline-block shadow-sm">
                {category}
              </h3>

              <div className="bg-[#fafafa] rounded-[25px] p-4 shadow-neon-blue">
                <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar snap-x">
                  {categoryProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="min-w-[200px] max-w-[200px] bg-white border border-happy-detail rounded-[15px] p-3 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col snap-start"
                    >
                      <img 
                        src={product.image} 
                        alt={product.nome} 
                        className="w-[110px] h-[110px] object-contain mx-auto mb-3 rounded-md"
                      />
                      
                      <div className="flex flex-col flex-grow text-center">
                        <h5 className="text-sm font-bold text-gray-800 mb-2 h-10 flex items-center justify-center leading-tight">
                          {product.nome}
                        </h5>
                        
                        <div className="mt-auto">
                          <p className="text-happy-pink font-bold text-base mb-2">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                          
                          <button 
                            onClick={() => handleSelectProduct(product)}
                            className="btn-primary w-full text-xs py-2 px-2"
                          >
                            Selecionar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
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